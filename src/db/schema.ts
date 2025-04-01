import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { z } from "zod";

const sizeEnum = ["XS", "S", "M", "L", "XL", "42", "44", "46"] as const;

export const usersTable = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  dni: integer("dni").unique(),
  phone: text("phone"),
  street: text("street"),
  streetNumber: integer("street_number"),
  postalCode: text("postal_code"),
  city: text("city"),
  state: text("state"),
  indications: text("indications"),
});

export const adminsTable = sqliteTable("admins", {
  id: integer("id").primaryKey(),
  email: text("email").unique().notNull(),
});

export const productsTable = sqliteTable("products", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  img: text("img").notNull(),
  size: text("size", {enum: ["XS", "S", "M", "L", "XL"]}).notNull(),
  price: integer("price").notNull(),
  isRecommended: integer("is_recommended", { mode: "boolean" })
    .default(true)
    .notNull(),
});

export const usersToProducts = sqliteTable("users_to_products", {
  id: integer("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  productId: integer("product_id")
    .notNull()
    .references(() => productsTable.id),
  quantity: integer("quantity").notNull(),
  delivery: integer("delivery", { mode: "boolean" }).default(true).notNull(),
  status: text("status", { enum: ["pending", "dispatched", "delivered"] })
    .notNull()
    .default("pending"),
  purchasedAt: text("purchased_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  usersToProducts: many(usersToProducts),
}));

export const productsRelations = relations(productsTable, ({ many }) => ({
  usersToProducts: many(usersToProducts),
}));

export const usersToProductsRelations = relations(
  usersToProducts,
  ({ one }) => ({
    product: one(productsTable, {
      fields: [usersToProducts.productId],
      references: [productsTable.id],
    }),
    user: one(usersTable, {
      fields: [usersToProducts.userId],
      references: [usersTable.id],
    }),
  }),
);


export type InsertUser = typeof usersTable.$inferInsert;
export type Selectuser = typeof usersTable.$inferSelect;

export type InsertProduct = typeof productsTable.$inferInsert;
export type SelectProduct = typeof productsTable.$inferSelect;

export type InsertUserToProduct = typeof usersToProducts.$inferInsert;
export type SelectUserToProduct = typeof usersToProducts.$inferSelect;

export const statusSchema = z.union([
  z.literal("pending"),
  z.literal("dispatched"),
  z.literal("delivered"),
]);

export const productSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  price: z.string(),
  img: z.instanceof(File),
  isRecommended: z.string().optional(),
});

export const editProductSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  price: z.string(),
  img: z.instanceof(File).optional(),
  publicId: z.string(),
  id: z.string(),
  isRecommended: z.string().optional(),
});