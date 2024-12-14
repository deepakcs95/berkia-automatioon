"use client";

import * as React from "react";
import {
   BookOpen,
  Bot,
  ChartBarIcon,
   DollarSign,
  Frame,
   Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/app/dashboard/_components/NavMain";
import { NavUser } from "@/app/dashboard/_components/NavUser";
import { AppSidebarHeader as SideBarHeaderMain } from "@/app/dashboard/_components/SidebarHeader";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
  
// This is sample data.
const data = {
   
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Automations",
      url: "/dashboard/automations",
      icon: Bot,
    },
    {
      title: "ChatBot",
      url: "/dashboard/chatbot",
      icon: ChartBarIcon,
    },
    {
      title: "Accounts",
      url: "/dashboard/account",
      icon: BookOpen,
    },
    {
      title: "Billing",
      url: "/dashboard/billing",
      icon: DollarSign,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
    },
  ],
   
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

   
 
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>

        <SideBarHeaderMain />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>

        <NavUser   />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
