import { pgTable, text, varchar, uuid, timestamp } from "drizzle-orm/pg-core";
import { baseFields } from "./base";
import { warehouses } from "./warehouses";
import { user } from "./auth";
import { transferStatusEnum } from "./warehouse-enums";

// Transfers table
export const transfers = pgTable("transfers", {
  ...baseFields,
  transferNumber: varchar("transfer_number", { length: 50 }).notNull().unique(),
  fromWarehouseId: uuid("from_warehouse_id").references(() => warehouses.id),
  toWarehouseId: uuid("to_warehouse_id").references(() => warehouses.id),
  status: transferStatusEnum("status").default("PENDING"),
  requestedBy: text("requested_by").references(() => user.id),
  approvedBy: text("approved_by").references(() => user.id),
  shippedAt: timestamp("shipped_at"),
  receivedAt: timestamp("received_at"),
  notes: text("notes"),
});

// Export types
export type Transfer = typeof transfers.$inferSelect;
export type NewTransfer = typeof transfers.$inferInsert;