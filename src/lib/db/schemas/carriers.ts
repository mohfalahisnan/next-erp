import { pgTable, varchar, text, boolean } from "drizzle-orm/pg-core";
import { baseFields } from "./base";

// Carriers table
export const carriers = pgTable("carriers", {
  ...baseFields,
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  contactInfo: text("contact_info"),
  apiEndpoint: varchar("api_endpoint", { length: 200 }),
  apiKey: varchar("api_key", { length: 200 }),
  isActive: boolean("is_active").default(true),
});

// Export types
export type Carrier = typeof carriers.$inferSelect;
export type NewCarrier = typeof carriers.$inferInsert;