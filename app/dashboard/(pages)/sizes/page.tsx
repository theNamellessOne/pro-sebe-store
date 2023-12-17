import { Suspense } from "react";
import { Loader } from "lucide-react";
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import { SizeTable } from "@/app/dashboard/(pages)/sizes/components/size-table";

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
