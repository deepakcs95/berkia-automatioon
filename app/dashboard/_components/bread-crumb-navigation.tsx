"use client";

import {
  Breadcrumb,
  BreadcrumbPage,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React from "react";

export default function BreadcrumbNavigation() {
  const pathname = usePathname();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathname.split("/").map((segment, index, array) => {
          if (!segment) return null;
          const isLast = index === array.length - 1;
          const href = `/${array.slice(1, index + 1).join("/")}`;
          const capitalizedSegment = segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <React.Fragment key={href}>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={href}>{capitalizedSegment}</BreadcrumbLink>
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
