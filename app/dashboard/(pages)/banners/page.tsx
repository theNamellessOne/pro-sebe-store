"use client";

import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import React, { Suspense } from "react";
import { readSearchParams, SearchParams } from "@/util/read-search-params";
import { BannerTable } from "@/app/dashboard/(pages)/banners/components/banner-table";
import { TableColumns } from "@/app/dashboard/components/table-columns";
import { TableColumnsProvider } from "../../providers/table-columns-provider";
import Loading from "@/app/loading";

export default async function Page({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const { query, currentPage, sortDescriptor } = readSearchParams(searchParams);

  return (
    <TableColumnsProvider
      storageName={"bannerColumns"}
      initialData={[
        { name: "Id", uid: "id", shown: true },
        { name: "Назва", uid: "name", shown: true },
        { name: "Картинка", uid: "imageUrl", shown: true },
        { name: "Верхнiй", uid: "shouldBeOnTop", shown: true },
      ]}
    >
      <div
        className={"relative flex flex-col gap-4 h-full w-full p-4 px-[20px]"}
      >
        <DashboardHeader title={"Банери"}>
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
          fallback={<Loading />}
        >
          <BannerTable
            query={query}
            page={currentPage}
            sortDescriptor={sortDescriptor}
          />
        </Suspense>
      </div>
    </TableColumnsProvider>
  );
}
