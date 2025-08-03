import { pgTable, text, varchar, uuid, decimal, boolean } from "drizzle-orm/pg-core";
import { baseFields } from "./base";
import { productCategories } from "./product-categories";
import { suppliers } from "./suppliers";

// Products table
export const products = pgTable("products", {
  ...baseFields,
  sku: varchar("sku", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  categoryId: uuid("category_id").references(() => productCategories.id),
  supplierId: uuid("supplier_id").references(() => suppliers.id),
  baseCostPrice: decimal("base_cost_price", { precision: 10, scale: 2 }),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  dimensions: varchar("dimensions", { length: 50 }),
  imageUrl: varchar("image_url", { length: 500 }),
  isActive: boolean("is_active").default(true),
});

// Export types
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;