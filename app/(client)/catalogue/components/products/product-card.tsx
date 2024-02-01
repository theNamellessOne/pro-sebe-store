"use client";

import { useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BsBag, BsBagCheck } from "react-icons/bs";
import { Button } from "@nextui-org/button";
import { Color } from "@/app/(client)/catalogue/components/color";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/(client)/cart/hooks/use-cart";

type ProductCardProps = {
  product: any;
};

export function ProductCard({ product }: ProductCardProps) {
  const { isInCart } = useCart();

  const url = `/catalogue/${product.article}`;
  const router = useRouter();

  const variants = product.variants;
  const [selected, setSelected] = useState(variants[0]);

  const redirectToProductPage = (queryParams?: string | undefined) => {
    if (queryParams) {
      router.push(url + `?${queryParams}`);
      return;
    }

    router.push(url);
  };

  const changeSelected = (colorId: number) => {
    const f = variants.find((variant: any) => variant.colorId === colorId);
    setSelected(f ?? variants[0]);
  };

  const colors = product.variants
    .map((variant: any) => variant.color)
    .filter(
      (color: any, idx: number, arr: any[]) =>
        arr.findIndex((color1) => color1.id === color.id) === idx,
    );

  return (
    <div
      className={
        "flex gap-4 items-center flex-col w-[330px] h-[520px] bg-secondary rounded-sm py-[20px] text-secondary-foreground"
      }
    >
      <div className={"relative w-[290px] h-[329px]"}>
        <Image
          className={"aspect-[290/329] object-cover"}
          src={
            selected.mediaUrls[0]
              ? selected.mediaUrls[0]?.url
              : "https://utfs.io/f/9f49f263-2475-45a1-8770-479fd5cb0c80-9w6i5v.png"
          }
          fill
          alt={product.name}
        />

        <Button
          className={"absolute rounded-sm top-1 right-1 z-99 text-3xl"}
          variant={"light"}
          color={"primary"}
          isIconOnly
        >
          <AiOutlineHeart />
        </Button>
      </div>

      <div className={"flex flex-col items-start w-[290px]"}>
        <Link href={url}>
          <h2 className={"font-semibold"}>{product.name}</h2>
        </Link>
      </div>

      <div className={"flex items-start justify-between gap-2 w-[290px] -mt-2"}>
        <div className={"flex flex-col gap-2"}>
          <h2 className={"font-semibold flex gap-2"}>
            {product.compareAtPrice > product.price && (
              <>
                <p className={"text-zinc-600 line-through"}>
                  {(Math.round(product.compareAtPrice * 100) / 100).toFixed(2)}
                </p>
              </>
            )}

            <> ₴{(Math.round(product.price * 100) / 100).toFixed(2)} UAH</>
          </h2>

          <div className={"flex gap-2"}>
            {colors.map((color: any) => {
              return (
                <button
                  key={color.id}
                  onClick={() =>
                    redirectToProductPage(`selectedColor=${color.id}`)
                  }
                  onMouseOver={() => {
                    changeSelected(color.id);
                  }}
                >
                  <Color
                    hex={color.hexValue}
                    className={`hover:scale-125 ${
                      selected.colorId === color.id && "scale-125"
                    } h-[30px] w-[30px] transition-all`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <Button
          onClick={() => redirectToProductPage()}
          variant={"light"}
          className={"rounded-sm text-3xl"}
          color={"primary"}
          isIconOnly
        >
          {isInCart(selected.id) ? <BsBag /> : <BsBagCheck />}
        </Button>
      </div>
    </div>
  );
}
