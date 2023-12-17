import { SortDirection } from "@react-types/shared";

export function convertSortDescriptorToPrisma(
  sortDescriptor: SortDirection | undefined,
) {
  if (sortDescriptor === "descending") {
    return "desc";
  }

  if (sortDescriptor === "ascending") {
    return "asc";
  }

  return sortDescriptor;
}

export function convertSortDescriptorFromPrisma(sortDescriptor: string) {
  return sortDescriptor === "desc" ? "descending" : "ascending";
}
