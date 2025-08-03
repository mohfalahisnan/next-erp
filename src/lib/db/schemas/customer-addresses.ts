import { pgTable, text, varchar, uuid, boolean } from "drizzle-orm/pg-core";
import { baseFields } from "./base";
import { customers } from "./customers";
import { addressTypeEnum } from "./warehouse-enums";

// Customer Addresses table
export const customerAddresses = pgTable("customer_addresses", {
  ...baseFields,
  customerId: uuid("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  addressType: addressTypeEnum("address_type").default("billing"),
  addressLine1: text("address_line_1").notNull(),
  addressLine2: text("address_line_2"),
  city: varchar("city", { length: 50 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 50 }).notNull(),
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
});

// Export types
export type CustomerAddress = typeof customerAddresses.$inferSelect;
export type NewCustomerAddress = typeof customerAddresses.$inferInsert;