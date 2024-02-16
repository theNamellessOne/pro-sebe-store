import { useContext } from "react";
import { ProductImageContext } from "../providers/product-image-provider";

export function useProductImage() {
  return useContext(ProductImageContext);
}
