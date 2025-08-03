import { pgTable, varchar, uuid, decimal, integer, boolean } from "drizzle-orm/pg-core";
import { baseFields } from "./base";
import { customerTypeEnum } from "./warehouse-enums";

// Customers table
export const customers = pgTable("customers", {
  ...baseFields,
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  customerType: customerTypeEnum("customer_type").default("RETAIL"),
  creditLimit: decimal("credit_limit", { precision: 10, scale: 2 }),
  paymentTerms: integer("payment_terms").default(30), // days
  taxId: varchar("tax_id", { length: 50 }),
  isActive: boolean("is_active").default(true),
});

// Export types
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;