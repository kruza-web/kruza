import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"
import { relations } from "drizzle-orm"
import { z } from "zod"

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
})

export const adminsTable = sqliteTable("admins", {
  id: integer("id").primaryKey(),
  email: text("email").unique().notNull(),
})

export const productsTable = sqliteTable("products", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category", { enum: ["top", "bottom", "vestidos"] }).notNull(),
  img: text("img").notNull(),
  img2: text("img2").notNull(),
  img3: text("img3").notNull(),
  img4: text("img4").notNull(),
  img5: text("img5").notNull(),
  img6: text("img6").notNull(),
  img7: text("img7").notNull(),
  img8: text("img8").notNull(),
  img9: text("img9").notNull(),
  img10: text("img10").notNull(),
  size: text("size").notNull(), // Mantenemos este campo para compatibilidad
  price: integer("price").notNull(),
  discount: integer("discount").default(0),
  isRecommended: integer("is_recommended", { mode: "boolean" }).default(true).notNull(),
})

// Nueva tabla para colores
export const colorsTable = sqliteTable("colors", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  hexCode: text("hex_code").notNull(),
})

// Nueva tabla para variantes de producto (combinaciones de producto, color y talle con stock)
export const productVariantsTable = sqliteTable("product_variants", {
  id: integer("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => productsTable.id),
  colorId: integer("color_id")
    .notNull()
    .references(() => colorsTable.id),
  size: text("size").notNull(), // XS, S, M, L, XL, Unique
  stock: integer("stock").notNull().default(0),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
})

export const usersToProducts = sqliteTable("users_to_products", {
  id: integer("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  productId: integer("product_id")
    .notNull()
    .references(() => productsTable.id),
  // Nuevo campo para la variante específica
  variantId: integer("variant_id").references(() => productVariantsTable.id),
  quantity: integer("quantity").notNull(),
  delivery: integer("delivery", { mode: "boolean" }).default(true).notNull(),
  status: text("status", { enum: ["pending", "dispatched", "delivered"] })
    .notNull()
    .default("pending"),
  purchasedAt: text("purchased_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  // **NUEVO CAMPO PARA EVITAR DUPLICADOS**
  paymentId: text("payment_id"), // ID del pago de Mercado Pago
})

// Relaciones
export const usersRelations = relations(usersTable, ({ many }) => ({
  usersToProducts: many(usersToProducts),
}))

export const productsRelations = relations(productsTable, ({ many }) => ({
  usersToProducts: many(usersToProducts),
  variants: many(productVariantsTable),
}))

export const colorsRelations = relations(colorsTable, ({ many }) => ({
  variants: many(productVariantsTable),
}))

export const productVariantsRelations = relations(productVariantsTable, ({ one }) => ({
  product: one(productsTable, {
    fields: [productVariantsTable.productId],
    references: [productsTable.id],
  }),
  color: one(colorsTable, {
    fields: [productVariantsTable.colorId],
    references: [colorsTable.id],
  }),
}))

export const usersToProductsRelations = relations(usersToProducts, ({ one }) => ({
  product: one(productsTable, {
    fields: [usersToProducts.productId],
    references: [productsTable.id],
  }),
  user: one(usersTable, {
    fields: [usersToProducts.userId],
    references: [usersTable.id],
  }),
  variant: one(productVariantsTable, {
    fields: [usersToProducts.variantId],
    references: [productVariantsTable.id],
  }),
}))

// Tipos
export type InsertUser = typeof usersTable.$inferInsert
export type SelectUser = typeof usersTable.$inferSelect

export type InsertProduct = typeof productsTable.$inferInsert
export type SelectProduct = typeof productsTable.$inferSelect

export type InsertColor = typeof colorsTable.$inferInsert
export type SelectColor = typeof colorsTable.$inferSelect

export type InsertProductVariant = typeof productVariantsTable.$inferInsert
export type SelectProductVariant = typeof productVariantsTable.$inferSelect

export type InsertUserToProduct = typeof usersToProducts.$inferInsert
export type SelectUserToProduct = typeof usersToProducts.$inferSelect

// Esquemas de validación
export const statusSchema = z.union([z.literal("pending"), z.literal("dispatched"), z.literal("delivered")])

export const productSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  price: z.string(),
  size: z.string(),
  img: z.instanceof(File).optional(),
  img2: z.instanceof(File).optional(),
  img3: z.instanceof(File).optional(),
  img4: z.instanceof(File).optional(),
  img5: z.instanceof(File).optional(),
  img6: z.instanceof(File).optional(),
  img7: z.instanceof(File).optional(),
  img8: z.instanceof(File).optional(),
  img9: z.instanceof(File).optional(),
  img10: z.instanceof(File).optional(),
  discount: z.string().optional(),
  isRecommended: z.string().optional(),
  category: z.enum(["top", "bottom", "vestidos"]),
})

export const editProductSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  price: z.string(),
  img: z.instanceof(File).optional(),
  img2: z.instanceof(File).optional(),
  img3: z.instanceof(File).optional(),
  img4: z.instanceof(File).optional(),
  img5: z.instanceof(File).optional(),
  img6: z.instanceof(File).optional(),
  img7: z.instanceof(File).optional(),
  img8: z.instanceof(File).optional(),
  img9: z.instanceof(File).optional(),
  img10: z.instanceof(File).optional(),
  publicId: z.string().optional(),
  publicId2: z.string().optional(),
  publicId3: z.string().optional(),
  publicId4: z.string().optional(),
  publicId5: z.string().optional(),
  publicId6: z.string().optional(),
  publicId7: z.string().optional(),
  publicId8: z.string().optional(),
  publicId9: z.string().optional(),
  publicId10: z.string().optional(),
  size: z.string(),
  discount: z.string().optional(),
  id: z.string(),
  isRecommended: z.string().optional(),
  category: z.enum(["top", "bottom", "vestidos"]),
})

// Nuevos esquemas para colores y variantes
export const colorSchema = z.object({
  name: z.string(),
  hexCode: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Código de color hexadecimal inválido"),
})

export const productVariantSchema = z.object({
  productId: z.number(),
  colorId: z.number(),
  size: z.string(),
  stock: z.number().int().min(0),
})
