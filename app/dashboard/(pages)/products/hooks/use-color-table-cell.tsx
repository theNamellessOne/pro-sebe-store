import { Key, useCallback } from "react";

export function useColorTableCell() {
  return useCallback(
    (
      color: {
        id: number;
        name: string;
        hexValue: string;
      },
      columnKey: Key,
    ) => {
      switch (columnKey) {
        case "id":
          return color.id;
        case "name":
          return color.name;
        case "hexValue":
          return (
            <div
              style={{ background: color.hexValue }}
              className={"h-12 w-12 rounded-xl"}
            ></div>
          );
      }
    },
    [],
  );
}
