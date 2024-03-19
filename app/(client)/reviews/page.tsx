import { SearchParams, readSearchParams } from "@/util/read-search-params";
import { Suspense } from "react";
import Loading from "@/app/loading";
import { ReviewList } from "./components/review-list";

export default async function Page({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const currentPage = Number(searchParams?.page) || 1;
  const sortDescriptor = searchParams?.sortDescriptor
    ? JSON.parse(searchParams?.sortDescriptor)
    : {
        column: "createdAt",
        direction: "descending",
      };

  return (
    <Suspense key={currentPage + sortDescriptor} fallback={<Loading />}>
      <ReviewList
        page={currentPage}
        sortColumn={sortDescriptor.column}
        sortDirection={sortDescriptor.direction}
      />
    </Suspense>
  );
}
