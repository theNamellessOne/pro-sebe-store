import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import React from "react";
import { CategoryView } from "@/app/dashboard/(pages)/categories/components/category-view";
import { readSearchParams, SearchParams } from "@/util/read-search-params";

export default async function Page({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const { query, currentPage, sortDescriptor } = readSearchParams(searchParams);

  return (
    <div className={"relative flex flex-col gap-4 h-full w-full p-4 px-[20px]"}>
      <DashboardHeader title={"Категорії"} />

      <CategoryView
        query={query}
        page={currentPage}
        sortDescriptor={sortDescriptor}
      />
    </div>
  );
}
