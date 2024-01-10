import { SortDescriptor } from "@nextui-org/react";
import { useList } from "@/hooks/use-list";
import { Category } from "@prisma/client";
import { CategoryService } from "@/service/category/category-service";

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

  return useList<Category>(props, CategoryService.instance.fetch);
}
