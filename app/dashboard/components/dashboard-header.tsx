"use client";

import { Button } from "@nextui-org/button";
import { Plus } from "lucide-react";
import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type DashboardHeaderProps = {
  title: string;
  children?: ReactNode;
  showCreateButton?: boolean;
  className?: string;
};

export function DashboardHeader({
  title,
  children,
  showCreateButton = true,
  className = "",
}: DashboardHeaderProps) {
  const pathname = usePathname();

  return (
    <header className={`flex justify-between items-center ${className}`}>
      <h3 className={"text-2xl font-semibold"}>{title}</h3>

      {children}

      {showCreateButton && (
        <Link href={pathname + "/new"}>
          <Button
            color={"primary"}
            variant={"shadow"}
            isIconOnly
            className={"mt-2"}
          >
            <Plus />
          </Button>
        </Link>
      )}
    </header>
  );
}
