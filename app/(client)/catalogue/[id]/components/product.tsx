"use client";

import "./../masonry.css";

import { useProduct } from "../hooks/use-product";
import { ProductImg } from "./product-img";
import { ProductInfo } from "./product-info";

export function Product({ product }: { product: any }) {
  const { selectedVariant, setSelectedColor, setSelectedSize } =
    useProduct(product);

  return (
    <div className="flex justify-center items-start py-4">
      <div className="w-1/2">
        <ProductImg selectedVariant={selectedVariant} />
      </div>

      <div className="w-1/2">
        <ProductInfo
          product={product}
          selectedVariant={selectedVariant}
          setSelectedSize={setSelectedSize}
          setSelectedColor={setSelectedColor}
        />
      </div>
    </div>
  );
}
