import { Key, useCallback } from "react";
import { VariantSave } from "@/app/dashboard/(pages)/products/schema/variant-schema";

export function userVariantTableCell() {
  return useCallback((variant: VariantSave, columnKey: Key) => {
    switch (columnKey) {
      case "name":
        return variant.name;
      case "reserved":
        return <p className={"text-gray-500"}>{variant.reserved ?? 0}</p>;
      case "quantity":
        return <p>{variant.quantity ?? 0}</p>;
    }
  }, []);
}
