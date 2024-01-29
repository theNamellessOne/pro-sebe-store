import { Filters } from "@/app/(client)/catalogue/components/filters/filters";
import { ProductList } from "@/app/(client)/catalogue/components/products/product-list";
import { Suspense } from "react";
import Loading from "@/app/loading";

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
        column: "article",
        direction: "ascending",
      };

  return (
    <>
      <Filters />
      <Suspense
        key={
          query + currentPage + sortDescriptor.direction + sortDescriptor.column
        }
        fallback={<Loading />}
      >
        <ProductList
          query={query}
          page={currentPage}
          sortDescriptor={sortDescriptor}
        />
      </Suspense>
    </>
  );
}
