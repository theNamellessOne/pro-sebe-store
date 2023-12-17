import { SortDescriptor } from "@nextui-org/react";
import { useList } from "@/hooks/use-list";
import { fetchSizes } from "@/service/size-service";

export function useSizeList(
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

  return useList(props, fetchSizes);
}
