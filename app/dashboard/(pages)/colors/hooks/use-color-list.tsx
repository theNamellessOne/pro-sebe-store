import { fetchColors } from "@/service/color-service";
import { SortDescriptor } from "@nextui-org/react";
import { useList } from "@/hooks/use-list";

export function useColorList(
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

  return useList(props, fetchColors);
}