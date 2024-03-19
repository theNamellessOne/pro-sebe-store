import { CategoryTreeContext } from "@/app/(client)/providers/category-tree-provider";
import { useContext } from "react";

export function useCategoryTree() {
  return useContext(CategoryTreeContext);
}
