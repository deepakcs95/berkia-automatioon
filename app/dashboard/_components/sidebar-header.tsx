"use client";

import * as React from "react";
import {   Instagram  } from "lucide-react";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";

export function SidebarHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex justify-between items-center">
        <Link href="/">
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
            <Instagram className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Instagram</span>
            <span className="truncate text-xs">Free</span>
          </div>
        </SidebarMenuButton>
          </Link>
          <ModeToggle />

      </SidebarMenuItem>
    </SidebarMenu>
  );
}
