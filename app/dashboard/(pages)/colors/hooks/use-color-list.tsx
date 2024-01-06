import { ColorService } from "@/app/dashboard/(pages)/colors/service/color-service";
import { SortDescriptor } from "@nextui-org/react";
import { useList } from "@/hooks/use-list";
import { Color } from "@prisma/client";

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

  return useList<Color>(props, ColorService.instance.fetch);
}
