import { Key, useCallback } from "react";
import { Category } from "@prisma/client";

export function useCategoryTableCell() {
  return useCallback(
    (category: { parent: Category | undefined } & Category, columnKey: Key) => {
      switch (columnKey) {
        case "id":
          return category.id;
        case "name":
          return category.name;
        case "parentId":
          return category.parent?.name;
      }
    },
    [],
  );
}
