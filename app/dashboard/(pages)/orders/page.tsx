"use client";

import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import { readSearchParams, SearchParams } from "@/util/read-search-params";
import { OrderTable } from "./components/order-table";
import { StatusFilter } from "@/app/dashboard/(pages)/orders/components/filter/status-filter";
import { TableColumnsProvider } from "@/app/dashboard/providers/table-columns-provider";
import { TableColumns } from "@/app/dashboard/components/table-columns";

export default async function Page({
  searchParams,
}: {
  searchParams?: SearchParams & { status?: string };
}) {
  const { query, currentPage, sortDescriptor } = readSearchParams(searchParams);
  const status = JSON.parse(searchParams?.status || '"ALL"');

  return (
    <TableColumnsProvider
      storageName={"orderColumns"}
      initialData={[
        { name: "Id", uid: "id", shown: true },
        { name: "Сума", uid: "total", shown: true },
        { name: "Повне Iм'я", uid: "fullName", shown: true },
        { name: "Телефон", uid: "phone", shown: true },
        { name: "Email", uid: "email", shown: true },
        { name: "Адреса", uid: "address", shown: true },
        { name: "Оплата", uid: "paymentType", shown: true },
        { name: "Статус", uid: "status", shown: true },
        { name: "Створена", uid: "createdAt", shown: true },
        { name: "Дiї", uid: "actions", shown: true },
      ]}
    >
      <div
        className={"relative flex flex-col gap-4 h-full w-full p-4 px-[20px]"}
      >
        <DashboardHeader title={"Замовлення"} showCreateButton={false}>
          <div className={"w-full flex gap-2 items-center justify-end"}>
            <StatusFilter />
            <TableColumns />
          </div>
        </DashboardHeader>

        <Suspense
          key={
            query +
            currentPage +
            sortDescriptor.direction +
            sortDescriptor.column +
            status
          }
          fallback={<Loader />}
        >
          <OrderTable
            query={query}
            page={currentPage}
            sortDescriptor={sortDescriptor}
            status={status}
          />
        </Suspense>
      </div>
    </TableColumnsProvider>
  );
}
