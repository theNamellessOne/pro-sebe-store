"use client";

import "./../masonry.css";

import { useProduct } from "../hooks/use-product";
import { ProductImg } from "./product-img";
import { ProductInfo } from "./product-info";

export function Product({ product }: { product: any }) {
  const { selectedVariant, setSelectedColor, setSelectedSize } =
    useProduct(product);

  return (
    <div
      className={
        "container mx-auto flex flex-col lg:flex-row gap-6 lg:gap-12 p-4"
      }
    >
      <div className={"lg:w-2/3"}>
        <ProductImg selectedVariant={selectedVariant} />
      </div>

      <div className={"lg:max-w-[600px] lg:w-1/3 shrink-0"}>
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
