import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import React, { Suspense } from "react";
import { ReviewTable } from "@/app/dashboard/(pages)/review/components/review-table";
import { Loader } from "lucide-react";
import { readSearchParams, SearchParams } from "@/util/read-search-params";

export default async function Page({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const { query, currentPage, sortDescriptor } = readSearchParams(searchParams);

  return (
    <>
      <div
        className={"relative flex flex-col gap-4 h-full w-full p-4 px-[20px]"}
      >
        <DashboardHeader title={"Відгуки"} showButton={false} />

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
    </>
  );
}
