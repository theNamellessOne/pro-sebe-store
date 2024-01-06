import { Suspense } from "react";
import { Loader } from "lucide-react";
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import { SizeTable } from "@/app/dashboard/(pages)/sizes/components/size-table";
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
        <DashboardHeader title={"Розміри"} />

        <Suspense
          key={
            query +
            currentPage +
            sortDescriptor.direction +
            sortDescriptor.column
          }
          fallback={<Loader />}
        >
          <SizeTable
            query={query}
            page={currentPage}
            sortDescriptor={sortDescriptor}
          />
        </Suspense>
      </div>
    </>
  );
}
