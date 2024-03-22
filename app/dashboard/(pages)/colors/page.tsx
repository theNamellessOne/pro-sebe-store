"use client";

import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import { ColorTable } from "@/app/dashboard/(pages)/colors/components/color-table";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import { readSearchParams, SearchParams } from "@/util/read-search-params";
import { TableColumnsProvider } from "@/app/dashboard/providers/table-columns-provider";
import { TableColumns } from "@/app/dashboard/components/table-columns";

export default async function Page({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const { query, currentPage, sortDescriptor } = readSearchParams(searchParams);

  return (
    <TableColumnsProvider
      storageName={"colorColumns"}
      initialData={[
        { name: "Id", uid: "id", shown: true },
        { name: "Назва", uid: "name", shown: true },
        { name: "Колір", uid: "hexValue", shown: true },
      ]}
    >
      <div
        className={"relative flex flex-col gap-4 h-full w-full p-4 px-[20px]"}
      >
        <DashboardHeader title={"Кольори"}>
          <div className={"w-full flex gap-2 justify-end mr-2"}>
            <TableColumns />
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
          <ColorTable
            query={query}
            page={currentPage}
            sortDescriptor={sortDescriptor}
          />
        </Suspense>
      </div>
    </TableColumnsProvider>
  );
}
