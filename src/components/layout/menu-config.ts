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
      url: "/",
      icon: IconDashboard,
    },
{
  title: "Products",
  url: "#",
  icon: IconPackage,
  items: [
    {
      title: "Product Catalog",
      url: "/products/catalog",
      icon: IconDatabase,
    },
    {
      title: "Categories",
      url: "/products/categories", 
      icon: IconFileDescription,
    },
    {
      title: "Pricing",
      url: "/products/pricing",
      icon: IconChartBar,
    },
    {
      title: "Product Variants",
      url: "/products/variants",
      icon: IconPackage,
    }
  ],
},
    {
      title: "Warehouse",
      url: "#",
      icon: IconDatabase,
      items: [
        {
          title: "Storage Locations",
          url: "/warehouse/locations",
          icon: IconBuilding,
        },
        {
          title: "Inventory",
          url: "/warehouse/inventory",
          icon: IconPackage,
        },
        {
          title: "Stock Movement",
          url: "/warehouse/movement",
          icon: IconTruck,
        },
      ],
    },
    {
      title: "Inventory Management",
      url: "#",
      icon: IconPackage,
      items: [
        {
          title: "Stock Levels",
          url: "/inventory/stock",
          icon: IconDatabase,
        },
        {
          title: "Reorder Points",
          url: "/inventory/reorder",
          icon: IconReport,
        },
        {
          title: "Batch Tracking",
          url: "/inventory/batches",
          icon: IconSearch,
        },
      ],
    },
    {
      title: "Operations",
      url: "#",
      icon: IconTruck,
      items: [
        {
          title: "Receiving",
          url: "/operations/receiving",
          icon: IconTruck,
        },
        {
          title: "Picking",
          url: "/operations/picking",
          icon: IconPackage,
        },
        {
          title: "Shipping",
          url: "/operations/shipping",
          icon: IconShoppingCart,
        },
      ],
    },
    {
      title: "Quality Control",
      url: "#",
      icon: IconCheck,
      items: [
        {
          title: "Inspections",
          url: "/quality/inspections",
          icon: IconSearch,
        },
        {
          title: "Returns",
          url: "/quality/returns",
          icon: IconTruck,
        },
        {
          title: "Quarantine",
          url: "/quality/quarantine",
          icon: IconShield,
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