import { pgTable, text, varchar, uuid } from "drizzle-orm/pg-core";
import { baseFields } from "./base";

// Product Categories table
export const productCategories = pgTable("product_categories", {
  ...baseFields,
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  parentId: uuid("parent_id"),
});

// Export types
export type ProductCategory = typeof productCategories.$inferSelect;
export type NewProductCategory = typeof productCategories.$inferInsert;