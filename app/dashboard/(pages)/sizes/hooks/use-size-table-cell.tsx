import { Key, useCallback } from "react";

export function useSizeTableCell() {
  return useCallback(
    (
      size: {
        id: number;
        name: string;
        chestSize: number;
        waistSize: number;
        thighSize: number;
      },
      columnKey: Key,
    ) => {
      //@ts-ignore
      return size[columnKey];
    },
    [],
  );
}
