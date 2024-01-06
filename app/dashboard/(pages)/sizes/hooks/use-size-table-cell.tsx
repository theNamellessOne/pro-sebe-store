import { Key, useCallback } from "react";
import { Size } from "@prisma/client";

export function useSizeTableCell() {
  return useCallback((size: Size, columnKey: Key) => {
    //@ts-ignore
    return size[columnKey];
  }, []);
}
