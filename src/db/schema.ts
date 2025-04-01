import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
