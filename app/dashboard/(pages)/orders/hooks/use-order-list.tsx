import { useList } from "@/hooks/use-list";
import { OrderService } from "@/service/order/order-service";
import { SortDescriptor } from "@nextui-org/react";
import { Order } from "@prisma/client";

export function useOrderList(
  query: string,
  page: number,
  sortDescriptor: SortDescriptor,
  status: string,
) {
  const props = {
    query,
    page,
    status,
    sortColumn: sortDescriptor?.column ?? "id",
    sortDirection: sortDescriptor?.direction ?? "ascending",
  };

  //@ts-ignore
  return useList<Order>(props, OrderService.instance.fetch);
}
