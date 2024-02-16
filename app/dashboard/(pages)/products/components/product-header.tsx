"use client";

import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import { CreateProductModal } from "./modals/create-product-modal";

export function ProductHeader() {
  return (
    <div className={"flex justify-between"}>
      <DashboardHeader title={"Товари"} showButton={false} />
      <CreateProductModal />
    </div>
  );
}
