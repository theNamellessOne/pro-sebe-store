"use client";

import { useProductList } from "@/app/(client)/catalogue/hooks/use-product-list";
import { ProductCard } from "@/app/(client)/catalogue/components/products/product-card";
import Loading from "@/app/loading";
import { TableProps } from "@/app/dashboard/types/table-props";

type ProductListProps = TableProps & {};

export function ProductList({ query, page, sortDescriptor }: ProductListProps) {
  const { list, loading, paginator } = useProductList(
    query,
    page,
    sortDescriptor,
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div
        className={
          "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4 w-fit mx-auto py-4"
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
