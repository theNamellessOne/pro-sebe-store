import { Key, useCallback } from "react";

export function useCategoryTableCell() {
  return useCallback(
    (
      category: {
        id: number;
        name: string;
        parent: any;
      },
      columnKey: Key,
    ) => {
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
