"use client";

import { useProductList } from "@/app/(client)/catalogue/hooks/use-product-list";
import { ProductCard } from "@/app/(client)/catalogue/components/products/product-card";
import Loading from "@/app/loading";
import { TableProps } from "@/app/dashboard/types/table-props";
import { PriceFilter } from "@/app/(client)/catalogue/types/product-filter";
import { NamedSortDescriptor } from "@/app/(client)/catalogue/hooks/use-product-sort-descriptor";
import { Filters } from "@/app/(client)/catalogue/components/filters/filters";
import { CategoryBreadcrumbs } from "../categories/category-breadcrumbs";
import { CategorySwiper } from "../categories/category-swiper";

type ProductListProps = TableProps & {
  sizes: number[];
  colors: number[];
  price: PriceFilter;
  categories: number[];
  sortDescriptor: NamedSortDescriptor;
  onlyDiscounts: boolean;
};

export function ProductList(props: ProductListProps) {
  const { list, loading, paginator } = useProductList({
    ...props,
    isDiscounted: props.onlyDiscounts,
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <CategoryBreadcrumbs
        currentCategoryId={props.categories ? props.categories[0] : 0}
      />

      <CategorySwiper
        currentCategoryId={props.categories ? props.categories[0] : 0}
      />

      <Filters />
      <div
        className={
          "container mx-auto grid " +
          "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 " +
          "gap-4 w-full px-6 py-4"
        }
      >
        {list.items.length === 0 && (
          <h2 className={"uppercase col-span-9"}>
            за вашими критеріями нічого не знайдено 😞
          </h2>
        )}
        {list.items.map((item) => {
          return <ProductCard key={item.article} product={item} />;
        })}
      </div>
      <div className={"pt-2 pb-8"}>{paginator}</div>
    </>
  );
}
