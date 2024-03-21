import { Key, useCallback } from "react";
import { VariantSave } from "@/schema/product/variant-schema";
import { ViewMediaModal } from "@/app/dashboard/(pages)/products/components/modals/view-media-modal";

export function useVariantTableCell() {
  return useCallback((variant: VariantSave, columnKey: Key) => {
    switch (columnKey) {
      case "media":
        return <ViewMediaModal variant={variant} />;
      case "name":
        return variant.name;
      case "sold":
        return <p>{variant.sold ?? 0}</p>;
      case "reserved":
        return <p>{variant.reserved ?? 0}</p>;
      case "quantity":
        return <p>{variant.quantity ?? 0}</p>;
    }
  }, []);
}
