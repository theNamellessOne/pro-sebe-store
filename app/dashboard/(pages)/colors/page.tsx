import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import { ColorTable } from "@/app/dashboard/(pages)/colors/components/color-table";
import { Suspense } from "react";
import { Loader } from "lucide-react";

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
        <DashboardHeader title={"Кольори"} />

        <Suspense
          key={
            query +
            currentPage +
            sortDescriptor.direction +
            sortDescriptor.column
          }
          fallback={<Loader />}
        >
          <ColorTable
            query={query}
            page={currentPage}
            sortDescriptor={sortDescriptor}
          />
        </Suspense>
      </div>
    </>
  );
}
