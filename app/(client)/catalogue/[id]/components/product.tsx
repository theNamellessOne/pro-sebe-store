"use client";

import { ProductInfo } from "./product-info";

export function Product({ product }: { product: any }) {
  return <ProductInfo product={product} />;
}
