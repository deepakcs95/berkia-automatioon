import * as React from "react";
import { Instagram } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/app/actions/user";
import { Skeleton } from "@/components/ui/skeleton";

export function AppSidebarHeader() {
  const {
    status,
    data: user,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

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
            <div className="grid flex-1  text-left text-sm leading-tight ">
              <span className="truncate font-semibold">Instagram</span>
            {status === "pending" &&(<>
                <Skeleton className="h-2 w-32 my-2" /> 
                <Skeleton className="h-2 w-20" /> 
            </>
            )} 
            { user && (
                <>
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.subscriptionPlan?.plan.plan}</span>
                </>
            )}
          </div>
          </SidebarMenuButton>
        </Link>
        <ModeToggle />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
