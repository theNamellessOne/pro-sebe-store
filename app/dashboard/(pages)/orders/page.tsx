import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import { readSearchParams, SearchParams } from "@/util/read-search-params";
import { OrderTable } from "./components/order-table";

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
        <DashboardHeader title={"Замовлення"} showButton={false} />

        <Suspense
          key={
            query +
            currentPage +
            sortDescriptor.direction +
            sortDescriptor.column
          }
          fallback={<Loader />}
        >
          <OrderTable
            query={query}
            page={currentPage}
            sortDescriptor={sortDescriptor}
          />
        </Suspense>
      </div>
    </>
  );
}
