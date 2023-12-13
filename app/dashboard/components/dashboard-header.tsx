"use client";

import { Button } from "@nextui-org/button";
import { Plus } from "lucide-react";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type DashboardHeaderProps = {
  title: string;
};

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const pathname = usePathname();

  return (
    <header className={"flex justify-between items-center"}>
      <h3 className={"text-3xl font-semibold"}>{title}</h3>
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
    </header>
  );
}
