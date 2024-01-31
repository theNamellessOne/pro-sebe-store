"use client";

import { useProductList } from "@/app/(client)/catalogue/hooks/use-product-list";
import { ProductCard } from "@/app/(client)/catalogue/components/products/product-card";
import Loading from "@/app/loading";
import { TableProps } from "@/app/dashboard/types/table-props";
import { PriceFilter } from "@/app/(client)/catalogue/types/product-filter";
import { NamedSortDescriptor } from "@/app/(client)/catalogue/hooks/use-product-sort-descriptor";

type ProductListProps = TableProps & {
  sizes: number[];
  colors: number[];
  price: PriceFilter;
  sortDescriptor: NamedSortDescriptor;
};

export function ProductList(props: ProductListProps) {
  const { list, loading, paginator } = useProductList(props);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div
        className={
          "container mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-fit py-4"
        }
      >
        {list.items.map((item) => {
          return <ProductCard key={item.article} product={item} />;
        })}
      </div>
      {paginator}
    </div>
  );
}
