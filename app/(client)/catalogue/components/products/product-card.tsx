"use client";

import { useState } from "react";
import { BsBag } from "react-icons/bs";
import { Button } from "@nextui-org/button";
import { Color } from "@/app/(client)/catalogue/components/color";

type ProductCardProps = {
  product: any;
};

export function ProductCard({ product }: ProductCardProps) {
  const variants = product.variants;
  const [selected, setSelected] = useState(variants[0]);
  const [shownImage, setShownImage] = useState<string | undefined>(
    variants[0]?.mediaUrls[0]?.url,
  );

  return (
    <div
      className={
        "flex gap-4 items-center flex-col w-[330px] h-[520px] bg-secondary rounded-sm py-[20px] text-secondary-foreground"
      }
    >
      <div className={"relative"}>
        <img
          src={
            selected.mediaUrls[0]
              ? selected.mediaUrls[0]?.url
              : "https://placehold.co/290x329/white/webp"
          }
          alt={product.name}
          className={
            "w-[290px] h-[329px] rounded-sm overflow-hidden object-cover"
          }
        />
      </div>

      <div className={"flex flex-col items-start w-[290px]"}>
        <h2 className={"font-semibold"}>{product.name}</h2>
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
            {variants.map((item: any) => {
              const color = item.color;
              return (
                <button
                  key={item.id}
                  onMouseOver={() => {
                    setSelected(item);
                  }}
                >
                  <Color
                    hex={color.hexValue}
                    className={`hover:scale-125 ${
                      selected.id === item.id && "scale-125"
                    } h-[30px] w-[30px] transition-all`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <Button
          variant={"light"}
          className={"rounded-sm text-3xl"}
          color={"primary"}
          isIconOnly
        >
          <BsBag />
        </Button>
      </div>
    </div>
  );
}
