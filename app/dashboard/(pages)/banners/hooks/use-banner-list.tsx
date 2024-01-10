import { SortDescriptor } from "@nextui-org/react";
import { useList } from "@/hooks/use-list";
import { Banner } from "@prisma/client";
import { BannerService } from "@/service/banner/banner-service";

export function useBannerList(
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

  return useList<Banner>(props, BannerService.instance.fetch);
}
