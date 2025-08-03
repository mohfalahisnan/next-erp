import { pgTable, text, varchar, uuid, decimal, boolean } from "drizzle-orm/pg-core";
import { baseFields } from "./base";
import { products } from "./products";

// Product Variants table
export const productVariants = pgTable("product_variants", {
  ...baseFields,
  productId: uuid("product_id").references(() => products.id),
  sku: varchar("sku", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  size: varchar("size", { length: 50 }),
  color: varchar("color", { length: 50 }),
  material: varchar("material", { length: 100 }),
  model: varchar("model", { length: 100 }),
  retailPrice: decimal("retail_price", { precision: 10, scale: 2 }).notNull(),
  wholesalePrice: decimal("wholesale_price", { precision: 10, scale: 2 }).notNull(),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  dimensions: varchar("dimensions", { length: 50 }),
  barcode: varchar("barcode", { length: 100 }),
  imageUrl: varchar("image_url", { length: 500 }),
  isActive: boolean("is_active").default(true),
});

// Export types
export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;