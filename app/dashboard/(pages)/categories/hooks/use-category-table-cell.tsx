import { Key, useCallback } from "react";
import { Category } from "@prisma/client";
import Image from "next/image";

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
        case "imageUrl":
          if (category.imageUrl) {
            return (
              <Image
                src={category.imageUrl}
                alt={"banner image"}
                height={100}
                width={100}
              />
            );
          }

          return <p>no image</p>;
      }
    },
    [],
  );
}
