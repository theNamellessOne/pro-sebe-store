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
              <div
                className={
                  "relative aspect-[4/3] h-64 rounded-large overflow-hidden"
                }
              >
                <Image fill src={category.imageUrl} alt={"banner image"} />
              </div>
            );
          }

          return <p>no image</p>;
      }
    },
    [],
  );
}
