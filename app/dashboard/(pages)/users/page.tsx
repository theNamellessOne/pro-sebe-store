import { Suspense } from "react";
import { Download, Loader } from "lucide-react";
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import { UserTable } from "@/app/dashboard/(pages)/users/components/user-table";
import { readSearchParams, SearchParams } from "@/util/read-search-params";
import { Button } from "@nextui-org/button";

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
          <Button
            className={"font-semibold"}
            variant={"shadow"}
            color={"primary"}
            startContent={<Download />}
          >
            Експортувати Пошти
          </Button>
        </div>

        <Suspense
          key={
            query +
            currentPage +
            sortDescriptor.direction +
            sortDescriptor.column
          }
          fallback={<Loader />}
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
