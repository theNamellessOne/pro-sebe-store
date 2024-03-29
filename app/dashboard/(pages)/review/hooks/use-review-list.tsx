import { SortDescriptor } from "@nextui-org/react";
import { useList } from "@/hooks/use-list";
import { Review } from "@prisma/client";
import { ReviewService } from "@/service/review/review-service";

export function useReviewList(
  query: string,
  page: number,
  sortDescriptor: SortDescriptor,
) {
  if (sortDescriptor.column === "actions") {
    sortDescriptor = {};
  }

  const props = {
    query,
    page,
    sortColumn: sortDescriptor?.column ?? "id",
    sortDirection: sortDescriptor?.direction ?? "ascending",
  };

  return useList<Review>(props, ReviewService.instance.fetch);
}
