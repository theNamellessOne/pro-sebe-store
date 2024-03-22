"use client";

import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import React from "react";
import { CategoryView } from "@/app/dashboard/(pages)/categories/components/category-view";
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
      storageName={"categoryColumns"}
      initialData={[
        { name: "Id", uid: "id", shown: true },
        { name: "Назва", uid: "name", shown: true },
        { name: "Батьківська Категорія", uid: "parentId", shown: true },
        { name: "Картинка", uid: "imageUrl", shown: true },
      ]}
    >
      <div
        className={"relative flex flex-col gap-4 h-full w-full p-4 px-[20px]"}
      >
        <DashboardHeader title={"Категорії"}>
          <div className={"w-full flex gap-2 items-center justify-end mr-2"}>
            <TableColumns />
          </div>
        </DashboardHeader>

        <CategoryView
          query={query}
          page={currentPage}
          sortDescriptor={sortDescriptor}
        />
      </div>
    </TableColumnsProvider>
  );
}
