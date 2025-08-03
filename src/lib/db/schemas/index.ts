// Export all enums
export * from "./enums";
export * from "./warehouse-enums";

// Export base fields
export * from "./base";

// Export all tables
export * from "./auth";
export * from "./departments";
export * from "./roles";
export * from "./projects";

// Export warehouse management tables
export * from "./warehouses";
export * from "./product-categories";
export * from "./suppliers";
export * from "./products";
export * from "./product-variants";
export * from "./inventory";
export * from "./inventory-movements";
export * from "./transfers";
export * from "./transfer-items";
export * from "./customers";
export * from "./customer-addresses";
export * from "./carriers";
export * from "./orders";
export * from "./order-items";
export * from "./shipments";

// Export all relations
export * from "./relations";
export * from "./warehouse-relations";

// Export warehouse indexes
// Temporarily disabled due to index creation issues
// export * from "./warehouse-indexes";