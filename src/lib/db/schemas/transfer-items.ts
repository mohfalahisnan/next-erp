import { pgTable, uuid, integer, timestamp } from "drizzle-orm/pg-core";
import { transfers } from "./transfers";
import { productVariants } from "./product-variants";

// Transfer Items table
export const transferItems = pgTable("transfer_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  transferId: uuid("transfer_id").references(() => transfers.id),
  productVariantId: uuid("product_variant_id").references(() => productVariants.id),
  requestedQuantity: integer("requested_quantity").notNull(),
  shippedQuantity: integer("shipped_quantity").default(0),
  receivedQuantity: integer("received_quantity").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Export types
export type TransferItem = typeof transferItems.$inferSelect;
export type NewTransferItem = typeof transferItems.$inferInsert;