import { pgTable, varchar, uuid, decimal, timestamp } from "drizzle-orm/pg-core";
import { baseFields } from "./base";
import { orders } from "./orders";
import { carriers } from "./carriers";
import { shipmentStatusEnum } from "./warehouse-enums";

// Shipments table
export const shipments = pgTable("shipments", {
  ...baseFields,
  shipmentNumber: varchar("shipment_number", { length: 50 }).notNull().unique(),
  orderId: uuid("order_id").references(() => orders.id),
  carrierId: uuid("carrier_id").references(() => carriers.id),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  shippingMethod: varchar("shipping_method", { length: 50 }),
  status: shipmentStatusEnum("status").default("PENDING"),
  shippedDate: timestamp("shipped_date"),
  estimatedDelivery: timestamp("estimated_delivery"),
  actualDelivery: timestamp("actual_delivery"),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  dimensions: varchar("dimensions", { length: 50 }),
});

// Export types
export type Shipment = typeof shipments.$inferSelect;
export type NewShipment = typeof shipments.$inferInsert;