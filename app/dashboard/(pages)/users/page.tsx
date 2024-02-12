import { Suspense } from "react";
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import { UserTable } from "@/app/dashboard/(pages)/users/components/user-table";
import { readSearchParams, SearchParams } from "@/util/read-search-params";
import { ExportEmailButton } from "./components/export-email-button";
import Loading from "@/app/loading";

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
        <div className={"flex justify-between"}>
          <DashboardHeader title={"Користувачi"} showButton={false} />
          <ExportEmailButton />
        </div>

        <Suspense
          key={
            query +
            currentPage +
            sortDescriptor.direction +
            sortDescriptor.column
          }
          fallback={<Loading />}
        >
          <UserTable
            query={query}
            page={currentPage}
            sortDescriptor={sortDescriptor}
          />
        </Suspense>
      </div>
    </>
  );
}
