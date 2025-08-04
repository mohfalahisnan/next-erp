import { IconBuilding, IconChartBar, IconCheck, IconDashboard, IconDatabase, IconFileDescription, IconHelp, IconPackage, IconReport, IconSearch, IconSettings, IconShield, IconShoppingCart, IconTruck } from "@tabler/icons-react";

export const menuConfig = {
  user: {
    name: "John Doe",
    email: "john@company.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Organization",
      url: "#",
      icon: IconBuilding,
      items: [
        {
          title: "Users",
          url: "/dashboard/users",
          icon: IconDatabase,
        },
        {
          title: "Departments",
          url: "/dashboard/departments",
          icon: IconBuilding,
        },
        {
          title: "Roles",
          url: "/dashboard/roles",
          icon: IconShield,
        },
        {
          title: "Projects",
          url: "/dashboard/projects",
          icon: IconFileDescription,
        },
      ],
    },
    {
      title: "Products",
      url: "#",
      icon: IconPackage,
      items: [
        {
          title: "Product Catalog",
          url: "/dashboard/products",
          icon: IconPackage,
        },
        {
          title: "Categories",
          url: "/dashboard/product-categories",
          icon: IconFileDescription,
        },
        {
          title: "Product Variants",
          url: "/dashboard/product-variants",
          icon: IconPackage,
        },
        {
          title: "Suppliers",
          url: "/dashboard/suppliers",
          icon: IconTruck,
        },
      ],
    },
    {
      title: "Warehouse",
      url: "#",
      icon: IconDatabase,
      items: [
        {
          title: "Storage Locations",
          url: "/dashboard/warehouses",
          icon: IconBuilding,
        },
        {
          title: "Inventory",
          url: "/dashboard/inventory",
          icon: IconPackage,
        },
        {
          title: "Stock Movements",
          url: "/dashboard/inventory-movements",
          icon: IconTruck,
        },
        {
          title: "Transfers",
          url: "/dashboard/transfers",
          icon: IconTruck,
        },
        {
          title: "Transfer Items",
          url: "/dashboard/transfer-items",
          icon: IconPackage,
        },
      ],
    },
    {
      title: "Customers",
      url: "#",
      icon: IconShoppingCart,
      items: [
        {
          title: "Customer List",
          url: "/dashboard/customers",
          icon: IconShoppingCart,
        },
        {
          title: "Customer Addresses",
          url: "/dashboard/customer-addresses",
          icon: IconBuilding,
        },
      ],
    },
    {
      title: "Orders & Shipping",
      url: "#",
      icon: IconTruck,
      items: [
        {
          title: "Orders",
          url: "/dashboard/orders",
          icon: IconShoppingCart,
        },
        {
          title: "Order Items",
          url: "/dashboard/order-items",
          icon: IconPackage,
        },
        {
          title: "Shipments",
          url: "/dashboard/shipments",
          icon: IconTruck,
        },
        {
          title: "Carriers",
          url: "/dashboard/carriers",
          icon: IconTruck,
        },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
      items: [
        {
          title: "Inventory Analytics",
          url: "/analytics/inventory",
          icon: IconChartBar,
        },
        {
          title: "Performance Metrics",
          url: "/analytics/performance",
          icon: IconReport,
        },
        {
          title: "Forecasting",
          url: "/analytics/forecasting",
          icon: IconFileDescription,
        },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: IconReport,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings
      ,
    },
    {
      title: "Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
}