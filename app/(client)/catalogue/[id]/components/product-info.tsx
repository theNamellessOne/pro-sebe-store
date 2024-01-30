"use client";

import { Check } from "lucide-react";
import { useProduct } from "../hooks/use-product";

export function ProductInfo({ product }: { product: any }) {
  const { selectedValues, setSelectedColor, setSelectedSize } = useProduct();

  if (selectedValues.colorId === -1) {
    selectedValues.colorId = product.variants[0].colorId;
  }

  if (selectedValues.sizeId === -1) {
    selectedValues.sizeId = product.variants[0].sizeId;
  }

  const colors = product.variants
    .map((variant: any) => variant.color)
    .filter(
      (color: any, idx: number, arr: any[]) =>
        arr.findIndex((color1) => color1.id === color.id) === idx,
    );

  const sizes = product.variants
    .map((variant: any) => variant.size)
    .filter(
      (size: any, idx: number, arr: any[]) =>
        arr.findIndex((size1) => size1.id === size.id) === idx,
    );

  return (
    <div className={"flex flex-col gap-2"}>
      <h2 className={"text-2xl"}>{product.name}</h2>
      <h3 className={"text-lg flex gap-2"}>
        {product.compareAtPrice > product.price && (
          <>
            <p className={"text-zinc-600 line-through"}>
              {(Math.round(product.compareAtPrice * 100) / 100).toFixed(2)}
            </p>
          </>
        )}

        <> {(Math.round(product.price * 100) / 100).toFixed(2)} UAH</>
      </h3>

      <h3 className={"text-lg"}>
        Колір - {colors.map((color: any) => color.name)}
      </h3>

      <div className={"flex gap-2"}>
        {colors.map((color: any) => {
          return (
            <button
              key={color.id}
              style={{ background: color.hexValue }}
              onClick={() => setSelectedColor(color.id)}
              className={
                "flex flex-col items-center justify-center h-[44px] w-[44px] rounded-sm relative"
              }
            >
              {color.id === selectedValues.colorId && (
                <div
                  className={
                    "absolute inset-0 flex justify-center items-center text-white"
                  }
                >
                  <Check />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <h3 className={"text-lg"}>
        Розмір - {sizes.map((size: any) => size.name)}
      </h3>

      <div className={"flex gap-2"}>
        {sizes.map((size: any) => {
          return (
            <button
              key={size.id}
              onClick={() => setSelectedSize(size.id)}
              className={
                "flex border-foreground border-1 flex-col items-center " +
                `${size.id === selectedValues.sizeId ? "bg-secondary" : ""}` +
                ` justify-center h-[44px] w-[44px] rounded-sm relative text-lg`
              }
            >
              {size.name}
            </button>
          );
        })}
      </div>

      <p>{product.description}</p>
    </div>
  );
}
