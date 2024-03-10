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
    colorFilter?: string;
    categoryFilter?: string;
    sizeFilter?: string;
    priceFilter?: string;
    onlyDiscounts?: boolean;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDescriptor = searchParams?.sortDescriptor
    ? JSON.parse(searchParams?.sortDescriptor)
    : null;
  const colorsFilter = searchParams?.colorFilter
    ? JSON.parse(searchParams?.colorFilter)
    : null;
  const categoryFilter = searchParams?.categoryFilter
    ? JSON.parse(searchParams?.categoryFilter)
    : null;
  const sizeFilter = searchParams?.sizeFilter
    ? JSON.parse(searchParams?.sizeFilter)
    : null;
  const priceFilter = searchParams?.priceFilter
    ? JSON.parse(searchParams?.priceFilter)
    : null;
  const discountFilter = searchParams?.onlyDiscounts?.valueOf();

  return (
    <>
      <Suspense
        key={
          query +
          currentPage +
          colorsFilter +
          sizeFilter +
          sortDescriptor?.name +
          sortDescriptor?.direction +
          sortDescriptor?.column +
          priceFilter?.min +
          priceFilter?.max +
          categoryFilter +
          discountFilter
        }
        fallback={<Loading />}
      >
        <ProductList
          query={query}
          page={currentPage}
          sortDescriptor={sortDescriptor?.value}
          colors={colorsFilter}
          sizes={sizeFilter}
          price={priceFilter}
          categories={categoryFilter}
          onlyDiscounts={!!discountFilter}
        />
      </Suspense>
    </>
  );
}
