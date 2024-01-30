"use client";

import { useProduct } from "../hooks/use-product";
import { ProductInfo } from "./product-info";

export function Product({ product }: { product: any }) {
  return <ProductInfo product={product} />;
}
