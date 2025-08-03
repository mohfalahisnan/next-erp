import { pgEnum } from "drizzle-orm/pg-core";

// Warehouse management enums
export const movementTypeEnum = pgEnum("movement_type", [
  "IN",
  "OUT", 
  "TRANSFER",
  "ADJUSTMENT"
]);

export const referenceTypeEnum = pgEnum("reference_type", [
  "PURCHASE",
  "SALE",
  "TRANSFER", 
  "ADJUSTMENT"
]);

export const transferStatusEnum = pgEnum("transfer_status", [
  "PENDING",
  "APPROVED",
  "IN_TRANSIT",
  "COMPLETED",
  "CANCELLED"
]);

export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "APPROVED",
  "CONFIRMED",
  "PICKING",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED"
]);

export const approvalStatusEnum = pgEnum("approval_status", [
  "PENDING",
  "APPROVED",
  "REJECTED"
]);

export const orderTypeEnum = pgEnum("order_type", [
  "SALE",
  "PURCHASE",
  "TRANSFER"
]);

export const customerTypeEnum = pgEnum("customer_type", [
  "RETAIL",
  "WHOLESALE"
]);

export const addressTypeEnum = pgEnum("address_type", [
  "billing",
  "shipping",
  "retail_location"
]);

export const shipmentStatusEnum = pgEnum("shipment_status", [
  "PENDING",
  "PICKED_UP",
  "IN_TRANSIT",
  "DELIVERED",
  "EXCEPTION"
]);