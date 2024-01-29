import { SortDescriptor } from "@nextui-org/react";
import { ProductService } from "@/service/product/product-service";
import { useAsyncList } from "@react-stately/data";
import { useState } from "react";
import { useSortDescriptor } from "@/hooks/use-sort-descriptor";
import { usePaginator } from "@/hooks/use-paginator";

export type ProductFilter = {
  price: {
    min: number;
    max: number;
  };
  sizes: number[];
  colors: number[];
};

export function useProductList(
  query: string,
  page: number,
  sortDescriptor: SortDescriptor,
) {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const handleSort = useSortDescriptor();
  const paginator = usePaginator(total, page);

  const fetch = async () => {
    setLoading(true);

    const props = {
      query,
      page,
      sortColumn: sortDescriptor?.column ?? "article",
      sortDirection: sortDescriptor?.direction ?? "ascending",
    };

    const { items, pages } =
      await ProductService.instance.fetchWithVariants(props);

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
