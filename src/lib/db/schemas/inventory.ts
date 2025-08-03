import { pgTable, varchar, uuid, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { baseFields } from "./base";
import { productVariants } from "./product-variants";
import { warehouses } from "./warehouses";

// Inventory table
export const inventory = pgTable("inventory", {
  ...baseFields,
  productVariantId: uuid("product_variant_id").references(() => productVariants.id),
  warehouseId: uuid("warehouse_id").references(() => warehouses.id),
  location: varchar("location", { length: 50 }),
  quantity: integer("quantity").notNull().default(0),
  reservedQuantity: integer("reserved_quantity").default(0),
  reorderPoint: integer("reorder_point").default(0),
  maxStock: integer("max_stock"),
  lastCountedAt: timestamp("last_counted_at"),
}, (table) => ({
  uniqueVariantWarehouseLocation: unique("unique_variant_warehouse_location").on(
    table.productVariantId,
    table.warehouseId,
    table.location
  ),
}));

// Export types
export type Inventory = typeof inventory.$inferSelect;
export type NewInventory = typeof inventory.$inferInsert;