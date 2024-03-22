"use client";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import { ProductTable } from "@/app/dashboard/(pages)/products/components/table/product-table";
import { TableColumnsProvider } from "../../providers/table-columns-provider";
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import { TableColumns } from "@/app/dashboard/components/table-columns";
import { CreateProductModal } from "@/app/dashboard/(pages)/products/components/modals/create-product-modal";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    sortDescriptor?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDescriptor = searchParams?.sortDescriptor
    ? JSON.parse(searchParams?.sortDescriptor)
    : {
        column: "article",
        direction: "ascending",
      };

  return (
    <TableColumnsProvider
      storageName={"productColumns"}
      initialData={[
        { name: "Артикул", uid: "article", shown: true },
        { name: "Назва", uid: "name", shown: true },
        { name: "Статус", uid: "status", shown: true },
        { name: "Цiна", uid: "price", shown: true },
        { name: "Скидка", uid: "isDiscounted", shown: true },
      ]}
    >
      <div
        className={"relative flex flex-col gap-4 h-full w-full p-4 px-[20px]"}
      >
        <DashboardHeader title={"Товари"} showCreateButton={false}>
          <div className={"w-full flex gap-2 items-center justify-end mr-2"}>
            <TableColumns />
            <CreateProductModal />
          </div>
        </DashboardHeader>

        <Suspense
          key={
            query +
            currentPage +
            sortDescriptor.direction +
            sortDescriptor.column
          }
          fallback={<Loader />}
        >
          <ProductTable
            query={query}
            page={currentPage}
            sortDescriptor={sortDescriptor}
          />
        </Suspense>
      </div>
    </TableColumnsProvider>
  );
}
