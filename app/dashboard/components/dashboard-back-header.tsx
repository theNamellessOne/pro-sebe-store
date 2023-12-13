"use client";

import { Button } from "@nextui-org/button";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

type DashboardBackHeaderProps = {
  title: string;
};

export function DashboardBackHeader({ title }: DashboardBackHeaderProps) {
  const router = useRouter();

  return (
    <header className={"flex items-center"}>
      <Button
        color={"primary"}
        variant={"light"}
        isIconOnly
        onClick={router.back}
      >
        <ArrowLeft />
      </Button>
      <h3 className={"text-2xl ml-2"}>{title}</h3>
    </header>
  );
}
