import { SortDescriptor } from "@nextui-org/react";
import { useList } from "@/hooks/use-list";
import { UserService } from "@/service/user/user-service";
import { UserReadDto } from "@/service/user/impl/user-fetch-service";

export function useUserList(
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

  return useList<UserReadDto>(props, UserService.instance.fetch);
}
