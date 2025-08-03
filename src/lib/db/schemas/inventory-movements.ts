import { pgTable, text, uuid, integer, timestamp } from "drizzle-orm/pg-core";
import { productVariants } from "./product-variants";
import { warehouses } from "./warehouses";
import { user } from "./auth";
import { movementTypeEnum, referenceTypeEnum } from "./warehouse-enums";

// Inventory Movements table
export const inventoryMovements = pgTable("inventory_movements", {
  id: uuid("id").primaryKey().defaultRandom(),
  productVariantId: uuid("product_variant_id").references(() => productVariants.id),
  warehouseId: uuid("warehouse_id").references(() => warehouses.id),
  movementType: movementTypeEnum("movement_type").notNull(),
  quantity: integer("quantity").notNull(),
  referenceType: referenceTypeEnum("reference_type"),
  referenceId: uuid("reference_id"),
  notes: text("notes"),
  performedBy: text("performed_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Export types
export type InventoryMovement = typeof inventoryMovements.$inferSelect;
export type NewInventoryMovement = typeof inventoryMovements.$inferInsert;