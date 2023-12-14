import React from "react";
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import {fetchAllColors} from "@/service/color-service";

export default async function Page() {
  const colors = await fetchAllColors();

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
