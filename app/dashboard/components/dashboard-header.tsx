"use client";

import { Button } from "@nextui-org/button";
import { Plus } from "lucide-react";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type DashboardHeaderProps = {
  title: string;
  showButton?: boolean;
};

export function DashboardHeader({
  title,
  showButton = true,
}: DashboardHeaderProps) {
  const pathname = usePathname();

  return (
    <header className={"flex justify-between items-center"}>
      <h3 className={"text-2xl font-semibold"}>{title}</h3>
      {showButton && (
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
