import { BannerService } from "@/app/dashboard/(pages)/banners/service/banner-service";
import { SortDescriptor } from "@nextui-org/react";
import { useList } from "@/hooks/use-list";
import { Banner } from "@prisma/client";

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
