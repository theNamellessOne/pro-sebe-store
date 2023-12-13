import React from "react";
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import prisma from "@/app/lib/prisma";

export default async function Page() {
  const colors = await prisma.color.findMany();

  return (
    <>
      <DashboardHeader title={"Кольори"} />
      {colors.map((item) => {
        return (
          <div style={{ background: item.hexValue }} key={item.id}>
            {item.name}
          </div>
        );
      })}
    </>
  );
}
