import { pgTable, text, varchar, uuid, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { baseFields } from "./base";
import { user } from "./auth";

// Warehouses table
export const warehouses = pgTable("warehouses", {
  ...baseFields,
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  address: text("address"),
  city: varchar("city", { length: 50 }),
  state: varchar("state", { length: 50 }),
  postalCode: varchar("postal_code", { length: 20 }),
  country: varchar("country", { length: 50 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 100 }),
  managerId: text("manager_id").references(() => user.id),
  capacity: integer("capacity"),
  isActive: boolean("is_active").default(true),
});

// Export types
export type Warehouse = typeof warehouses.$inferSelect;
export type NewWarehouse = typeof warehouses.$inferInsert;