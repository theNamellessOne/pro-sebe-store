"use client";

import { ProductCard } from "@/app/(client)/catalogue/components/products/product-card";
import { PriceFilter } from "@/app/(client)/catalogue/types/product-filter";
import NProgress from "nprogress";
import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/service/product/product-service";
import { usePaginator } from "@/hooks/use-paginator";

type ProductListProps = {
  query: string;
  page: number;
  sizes: number[];
  colors: number[];
  price: PriceFilter;
  categories: number[];
  sortColumn: string;
  sortDirection: "ascending" | "descending";
  isDiscounted: boolean;
};

export function ProductList(props: ProductListProps) {
  const query = useQuery({
    queryKey: [
      "catalogue",
      props.sortDirection,
      props.sortColumn,
      props.isDiscounted,
      props.price.min,
      props.price.max,
      props.page,
      props.query,
      ...props.categories,
      ...props.sizes,
      ...props.colors,
    ],
    queryFn: () => ProductService.instance.fetchAndFilter(props),
  });
  const { data } = query;
  const paginator = usePaginator(data?.pages || 0, props.page);

  NProgress.done();

  return (
    <>
      <div
        className={
          "container mx-auto grid " +
          "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 " +
          "gap-4 w-full px-6 py-4"
        }
      >
        {!data?.items ||
          (data.items.length === 0 && (
            <h2 className={"uppercase col-span-9"}>
              за вашими критеріями нічого не знайдено 😞
            </h2>
          ))}
        {data?.items.map((item) => {
          return <ProductCard key={item.article} product={item} />;
        })}
      </div>
      <div className={"pt-2 pb-8"}>{paginator}</div>
    </>
  );
}
