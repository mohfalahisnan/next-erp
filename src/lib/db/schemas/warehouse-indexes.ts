import { index } from "drizzle-orm/pg-core";
import { productVariants } from "./product-variants";
import { inventory } from "./inventory";
import { inventoryMovements } from "./inventory-movements";
import { transfers } from "./transfers";
import { orders } from "./orders";
import { shipments } from "./shipments";

// Performance indexes for warehouse management

// Product Variants indexes
export const idxProductVariantsProduct = index("idx_product_variants_product").on(productVariants.productId);
export const idxProductVariantsSku = index("idx_product_variants_sku").on(productVariants.sku);
export const idxProductVariantsBarcode = index("idx_product_variants_barcode").on(productVariants.barcode);

// Inventory indexes
export const idxInventoryVariantWarehouse = index("idx_inventory_variant_warehouse").on(
  inventory.productVariantId,
  inventory.warehouseId
);
export const idxInventoryWarehouse = index("idx_inventory_warehouse").on(inventory.warehouseId);
export const idxInventoryVariant = index("idx_inventory_variant").on(inventory.productVariantId);

// Inventory Movements indexes
export const idxInventoryMovementsVariant = index("idx_inventory_movements_variant").on(
  inventoryMovements.productVariantId
);
export const idxInventoryMovementsWarehouse = index("idx_inventory_movements_warehouse").on(
  inventoryMovements.warehouseId
);
export const idxInventoryMovementsType = index("idx_inventory_movements_type").on(
  inventoryMovements.movementType
);
export const idxInventoryMovementsCreated = index("idx_inventory_movements_created").on(
  inventoryMovements.createdAt
);

// Transfers indexes
export const idxTransfersStatus = index("idx_transfers_status").on(transfers.status);
export const idxTransfersFromWarehouse = index("idx_transfers_from_warehouse").on(transfers.fromWarehouseId);
export const idxTransfersToWarehouse = index("idx_transfers_to_warehouse").on(transfers.toWarehouseId);
export const idxTransfersNumber = index("idx_transfers_number").on(transfers.transferNumber);

// Orders indexes
export const idxOrdersStatus = index("idx_orders_status").on(orders.status);
export const idxOrdersApprovalStatus = index("idx_orders_approval_status").on(orders.approvalStatus);
export const idxOrdersCustomer = index("idx_orders_customer").on(orders.customerId);
export const idxOrdersWarehouse = index("idx_orders_warehouse").on(orders.warehouseId);
export const idxOrdersNumber = index("idx_orders_number").on(orders.orderNumber);
export const idxOrdersDate = index("idx_orders_date").on(orders.orderDate);

// Shipments indexes
export const idxShipmentsTracking = index("idx_shipments_tracking").on(shipments.trackingNumber);
export const idxShipmentsStatus = index("idx_shipments_status").on(shipments.status);
export const idxShipmentsOrder = index("idx_shipments_order").on(shipments.orderId);
export const idxShipmentsCarrier = index("idx_shipments_carrier").on(shipments.carrierId);
export const idxShipmentsNumber = index("idx_shipments_number").on(shipments.shipmentNumber);