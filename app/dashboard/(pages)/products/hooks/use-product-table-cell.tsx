import { Key, useCallback } from "react";
import { Product } from "@prisma/client";
import { ColorMessage } from "@/app/dashboard/components/colored-message";

export function useProductTableCell() {
  return useCallback((product: Product, columnKey: Key) => {
    switch (columnKey) {
      case "article":
        return product.article;
      case "name":
        return product.name;
      case "status":
        let color = "red";
        switch (product.status) {
          case "ACTIVE":
            color = "green";
            break;
          case "DRAFT":
            color = "blue";
            break;
          case "ARCHIVED":
            color = "yellow";
            break;
        }

        return (
          <ColorMessage
            text={product.status}
            //@ts-ignore
            color={color}
            classNames={{
              wrapper: "p-3 rounded-medium",
              inner: "font-semibold",
            }}
          />
        );

      case "isDiscounted":
        return (
          <ColorMessage
            text={String(product.isDiscounted)}
            color={product.isDiscounted ? "blue" : "dark"}
            classNames={{
              wrapper: "p-3 rounded-medium",
              inner: "font-semibold",
            }}
          />
        );

      case "price":
        //@ts-ignore
        const price = (Math.round(product.price * 100) / 100).toFixed(2);

        return (
          <ColorMessage
            text={price + " UAH"}
            color={product.isDiscounted ? "blue" : "dark"}
            classNames={{
              wrapper: "p-3 rounded-medium",
              inner: "font-semibold",
            }}
          />
        );
    }
  }, []);
}
