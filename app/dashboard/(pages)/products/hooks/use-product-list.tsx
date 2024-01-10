import { SortDescriptor } from "@nextui-org/react";
import { useList } from "@/hooks/use-list";
import { Product } from "@prisma/client";
import { ProductService } from "@/service/product/product-service";

export function useProductList(
  query: string,
  page: number,
  sortDescriptor: SortDescriptor,
) {
  const props = {
    query,
    page,
    sortColumn: sortDescriptor?.column ?? "id",
    sortDirection: sortDescriptor?.direction ?? "ascending",
  };

  return useList<Product>(props, ProductService.instance.fetch);
}
