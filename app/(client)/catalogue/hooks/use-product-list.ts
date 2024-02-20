import { ProductService } from "@/service/product/product-service";
import { useAsyncList } from "@react-stately/data";
import { useState } from "react";
import { useSortDescriptor } from "@/hooks/use-sort-descriptor";
import { usePaginator } from "@/hooks/use-paginator";
import { PriceFilter } from "@/app/(client)/catalogue/types/product-filter";
import { NamedSortDescriptor } from "@/app/(client)/catalogue/hooks/use-product-sort-descriptor";

export type ProductFilter = {
  query: string;
  page: number;
  sortDescriptor: NamedSortDescriptor;

  sizes: number[];
  colors: number[];
  categories: number[];
  price: PriceFilter;
};

export function useProductList(filter: ProductFilter) {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const handleSort = useSortDescriptor();
  const paginator = usePaginator(total, filter.page);

  const fetch = async () => {
    setLoading(true);

    const props = {
      query: filter.query,
      page: filter.page,
      sortColumn: filter.sortDescriptor?.column ?? "article",
      sortDirection: filter.sortDescriptor?.direction ?? "ascending",
      sizes: filter.sizes ?? [],
      colors: filter.colors ?? [],
      categories: filter.categories ?? [],
      price: filter.price ?? { min: -1, max: -1 },
    };

    const { items, pages } =
      await ProductService.instance.fetchAndFilter(props);

    setTotal(pages);
    setLoading(false);

    return { items };
  };

  return {
    loading,
    setLoading,
    list: useAsyncList({
      async load() {
        return fetch();
      },
    }),
    paginator,
  };
}
