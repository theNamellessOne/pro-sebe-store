import { SortDescriptor } from "@nextui-org/react";
import { useList } from "@/hooks/use-list";
import { fetchCategories } from "@/service/category-service";

export function useCategoryList(
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

  return useList(props, fetchCategories);
}
