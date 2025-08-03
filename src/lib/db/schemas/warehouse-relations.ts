import { relations } from "drizzle-orm";
import { warehouses } from "./warehouses";
import { products } from "./products";
import { productCategories } from "./product-categories";
import { productVariants } from "./product-variants";
import { suppliers } from "./suppliers";
import { inventory } from "./inventory";
import { inventoryMovements } from "./inventory-movements";
import { transfers } from "./transfers";
import { transferItems } from "./transfer-items";
import { customers } from "./customers";
import { customerAddresses } from "./customer-addresses";
import { orders } from "./orders";
import { orderItems } from "./order-items";
import { shipments } from "./shipments";
import { carriers } from "./carriers";
import { user } from "./auth";

// Warehouse Relations
export const warehousesRelations = relations(warehouses, ({ one, many }) => ({
  manager: one(user, {
    fields: [warehouses.managerId],
    references: [user.id],
  }),
  inventory: many(inventory),
  inventoryMovements: many(inventoryMovements),
  transfersFrom: many(transfers, { relationName: "fromWarehouse" }),
  transfersTo: many(transfers, { relationName: "toWarehouse" }),
  orders: many(orders),

}));

// Product Category Relations
export const productCategoriesRelations = relations(productCategories, ({ one, many }) => ({
  parent: one(productCategories, {
    fields: [productCategories.parentId],
    references: [productCategories.id],
    relationName: "parentCategory",
  }),
  children: many(productCategories, {
    relationName: "parentCategory",
  }),
  products: many(products),
}));

// Supplier Relations
export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
}));

// Product Relations
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id],
  }),
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id],
  }),
  variants: many(productVariants),
}));

// Product Variant Relations
export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  inventory: many(inventory),
  inventoryMovements: many(inventoryMovements),
  transferItems: many(transferItems),
  orderItems: many(orderItems),
}));

// Inventory Relations
export const inventoryRelations = relations(inventory, ({ one }) => ({
  productVariant: one(productVariants, {
    fields: [inventory.productVariantId],
    references: [productVariants.id],
  }),
  warehouse: one(warehouses, {
    fields: [inventory.warehouseId],
    references: [warehouses.id],
  }),
}));

// Inventory Movement Relations
export const inventoryMovementsRelations = relations(inventoryMovements, ({ one }) => ({
  productVariant: one(productVariants, {
    fields: [inventoryMovements.productVariantId],
    references: [productVariants.id],
  }),
  warehouse: one(warehouses, {
    fields: [inventoryMovements.warehouseId],
    references: [warehouses.id],
  }),
  performedBy: one(user, {
    fields: [inventoryMovements.performedBy],
    references: [user.id],
  }),
}));

// Transfer Relations
export const transfersRelations = relations(transfers, ({ one, many }) => ({
  fromWarehouse: one(warehouses, {
    fields: [transfers.fromWarehouseId],
    references: [warehouses.id],
    relationName: "fromWarehouse",
  }),
  toWarehouse: one(warehouses, {
    fields: [transfers.toWarehouseId],
    references: [warehouses.id],
    relationName: "toWarehouse",
  }),
  requestedBy: one(user, {
    fields: [transfers.requestedBy],
    references: [user.id],
    relationName: "requestedBy",
  }),
  approvedBy: one(user, {
    fields: [transfers.approvedBy],
    references: [user.id],
    relationName: "approvedBy",
  }),
  items: many(transferItems),
}));

// Transfer Item Relations
export const transferItemsRelations = relations(transferItems, ({ one }) => ({
  transfer: one(transfers, {
    fields: [transferItems.transferId],
    references: [transfers.id],
  }),
  productVariant: one(productVariants, {
    fields: [transferItems.productVariantId],
    references: [productVariants.id],
  }),
}));

// Customer Relations
export const customersRelations = relations(customers, ({ many }) => ({
  addresses: many(customerAddresses),
  orders: many(orders),
}));

// Customer Address Relations
export const customerAddressesRelations = relations(customerAddresses, ({ one, many }) => ({
  customer: one(customers, {
    fields: [customerAddresses.customerId],
    references: [customers.id],
  }),
  billingOrders: many(orders, { relationName: "billingAddress" }),
  shippingOrders: many(orders, { relationName: "shippingAddress" }),
}));

// Carrier Relations
export const carriersRelations = relations(carriers, ({ many }) => ({
  shipments: many(shipments),
}));

// Order Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  warehouse: one(warehouses, {
    fields: [orders.warehouseId],
    references: [warehouses.id],
  }),
  billingAddress: one(customerAddresses, {
    fields: [orders.billingAddressId],
    references: [customerAddresses.id],
    relationName: "billingAddress",
  }),
  shippingAddress: one(customerAddresses, {
    fields: [orders.shippingAddressId],
    references: [customerAddresses.id],
    relationName: "shippingAddress",
  }),
  approvedBy: one(user, {
    fields: [orders.approvedBy],
    references: [user.id],
    relationName: "approvedBy",
  }),
  createdBy: one(user, {
    fields: [orders.createdBy],
    references: [user.id],
    relationName: "createdBy",
  }),
  items: many(orderItems),
  shipments: many(shipments),
}));

// Order Item Relations
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  productVariant: one(productVariants, {
    fields: [orderItems.productVariantId],
    references: [productVariants.id],
  }),
}));

// Shipment Relations
export const shipmentsRelations = relations(shipments, ({ one }) => ({
  order: one(orders, {
    fields: [shipments.orderId],
    references: [orders.id],
  }),
  carrier: one(carriers, {
    fields: [shipments.carrierId],
    references: [carriers.id],
  }),
}));