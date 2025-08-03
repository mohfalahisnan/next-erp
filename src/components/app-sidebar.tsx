"use client"

import * as React from "react"
import {
  IconBuilding,
  IconChartBar,
  IconCheck,
  IconDashboard,
  IconDatabase,
  IconFileDescription,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconPackage,
  IconReport,
  IconSearch,
  IconSettings,
  IconShield,
  IconShoppingCart,
  IconTruck,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
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
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
      items: [
        {
          title: "Sales Analytics",
          url: "/analytics/sales",
          icon: IconChartBar,
        },
        {
          title: "User Analytics",
          url: "/analytics/users",
          icon: IconUsers,
        },
        {
          title: "Performance",
          url: "/analytics/performance",
          icon: IconReport,
        },
      ],
    },
    {
      title: "Projects",
      url: "#",
      icon: IconFolder,
      items: [
        {
          title: "Active Projects",
          url: "/projects/active",
          icon: IconFolder,
        },
        {
          title: "Completed",
          url: "/projects/completed",
          icon: IconCheck,
        },
        {
          title: "Templates",
          url: "/projects/templates",
          icon: IconFileDescription,
        },
      ],
    },
    {
      title: "Team",
      url: "#",
      icon: IconUsers,
      items: [
        {
          title: "Members",
          url: "/team/members",
          icon: IconUsers,
        },
        {
          title: "Departments",
          url: "/team/departments",
          icon: IconBuilding,
        },
        {
          title: "Roles",
          url: "/team/roles",
          icon: IconShield,
        },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: IconReport,
    },
    {
      title: "Inventory",
      url: "#",
      icon: IconDatabase,
      items: [
         {
           title: "Products",
           url: "/inventory/products",
           icon: IconPackage,
           items: [
             {
               title: "Electronics",
               url: "/inventory/products/electronics",
               icon: IconPackage,
             },
             {
               title: "Clothing",
               url: "/inventory/products/clothing",
               icon: IconPackage,
             },
             {
               title: "Books",
               url: "/inventory/products/books",
               icon: IconPackage,
             },
           ],
         },
         {
           title: "Stock Levels",
           url: "/inventory/stock",
           icon: IconDatabase,
         },
         {
           title: "Suppliers",
           url: "/inventory/suppliers",
           icon: IconTruck,
         },
         {
           title: "Orders",
           url: "/inventory/orders",
           icon: IconShoppingCart,
           items: [
             {
               title: "Pending",
               url: "/inventory/orders/pending",
               icon: IconShoppingCart,
             },
             {
               title: "Completed",
               url: "/inventory/orders/completed",
               icon: IconCheck,
             },
             {
               title: "Cancelled",
               url: "/inventory/orders/cancelled",
               icon: IconReport,
             },
           ],
         },
       ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">ERP Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}