import { useList } from "@/hooks/use-list";
import { OrderService } from "@/service/order/order-service";
import { SortDescriptor } from "@nextui-org/react";
import { Order } from "@prisma/client";

export function useOrderList(
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

  return useList<Order>(props, OrderService.instance.fetch);
}
