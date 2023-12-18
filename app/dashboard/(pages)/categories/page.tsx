import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import React, { Suspense } from "react";
import { Loader } from "lucide-react";
import { CategoryTable } from "@/app/dashboard/(pages)/categories/components/category-table";
import { CategoryTree } from "@/app/dashboard/(pages)/categories/components/category-tree";

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
        column: "id",
        direction: "ascending",
      };

  return (
    <div className={"relative flex flex-col gap-4 h-full w-full p-4 px-[20px]"}>
      <DashboardHeader title={"Категорії"} />
      <Suspense
        key={
          query + currentPage + sortDescriptor.direction + sortDescriptor.column
        }
        fallback={<Loader />}
      >
        <CategoryTable
          query={query}
          page={currentPage}
          sortDescriptor={sortDescriptor}
        />
      </Suspense>

      <CategoryTree />
    </div>
  );
}
