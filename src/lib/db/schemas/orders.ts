import { pgTable, text, varchar, uuid, decimal, timestamp } from "drizzle-orm/pg-core";
import { baseFields } from "./base";
import { customers } from "./customers";
import { customerAddresses } from "./customer-addresses";
import { warehouses } from "./warehouses";
import { user } from "./auth";
import { orderStatusEnum, approvalStatusEnum, orderTypeEnum } from "./warehouse-enums";

// Orders table
export const orders = pgTable("orders", {
  ...baseFields,
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  customerId: uuid("customer_id").references(() => customers.id),
  warehouseId: uuid("warehouse_id").references(() => warehouses.id),
  billingAddressId: uuid("billing_address_id").references(() => customerAddresses.id),
  shippingAddressId: uuid("shipping_address_id").references(() => customerAddresses.id),
  status: orderStatusEnum("status").default("PENDING"),
  approvalStatus: approvalStatusEnum("approval_status").default("PENDING"),
  approvedBy: text("approved_by").references(() => user.id),
  approvedAt: timestamp("approved_at"),
  approvalNotes: text("approval_notes"),
  orderDate: timestamp("order_date").defaultNow(),
  requiredDate: timestamp("required_date"),
  shippedDate: timestamp("shipped_date"),
  deliveryDate: timestamp("delivery_date"),
  orderType: orderTypeEnum("order_type").default("SALE"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdBy: text("created_by").references(() => user.id),
});

// Export types
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;