import { Key, useCallback } from "react";
import { Product } from "@prisma/client";

export function useProductTableCell() {
  return useCallback((product: Product, columnKey: Key) => {
    switch (columnKey) {
      case "article":
        return product.article;
      case "name":
        return product.name;
      case "status":
        return product.status;
      case "price":
        return product.price.toString();
    }
  }, []);
}
