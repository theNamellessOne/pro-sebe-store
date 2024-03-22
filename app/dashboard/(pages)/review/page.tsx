"use client";

import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import React, { Suspense } from "react";
import { ReviewTable } from "@/app/dashboard/(pages)/review/components/review-table";
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
      storageName={"reviewColumns"}
      initialData={[
        { name: "Id", uid: "id", shown: true },
        { name: "Контент", uid: "content", shown: true },
        { name: "Статус", uid: "status", shown: true },
        { name: "Рейтинг", uid: "rating", shown: true },
        { name: "Дi", uid: "actions", shown: true },
      ]}
    >
      <div
        className={"relative flex flex-col gap-4 h-full w-full p-4 px-[20px]"}
      >
        <DashboardHeader title={"Відгуки"} showCreateButton={false}>
          <div className={"w-full flex gap-2 items-center justify-end mr-2"}>
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
          <ReviewTable
            query={query}
            page={currentPage}
            sortDescriptor={sortDescriptor}
          />
        </Suspense>
      </div>
    </TableColumnsProvider>
  );
}
