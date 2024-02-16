import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import { readSearchParams, SearchParams } from "@/util/read-search-params";
import { OrderTable } from "./components/order-table";
import { StatusFilter } from "@/app/dashboard/(pages)/orders/components/filter/status-filter";

export default async function Page({
  searchParams,
}: {
  searchParams?: SearchParams & { status?: string };
}) {
  const { query, currentPage, sortDescriptor } = readSearchParams(searchParams);
  const status = JSON.parse(searchParams?.status || '"ALL"');

  return (
    <>
      <div
        className={"relative flex flex-col gap-4 h-full w-full p-4 px-[20px]"}
      >
        <div className={"flex justify-between"}>
          <DashboardHeader title={"Замовлення"} showButton={false} />
          <StatusFilter />
        </div>

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
    </>
  );
}
