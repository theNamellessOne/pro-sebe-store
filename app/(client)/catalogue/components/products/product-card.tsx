"use client";

import { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsBag, BsBagCheck } from "react-icons/bs";
import { Button } from "@nextui-org/button";
import { Color } from "@/app/(client)/catalogue/components/color";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/(checkout)/cart/hooks/use-cart";
import { useUserFavorites } from "@/app/(client)/hooks/use-user-favorites";
import { useSession } from "next-auth/react";
import { UnauthorizedModal } from "@/app/(client)/home/components/modal/unauthorized-modal";
import { useDisclosure } from "@nextui-org/react";

type ProductCardProps = {
  product: any;
};

export function ProductCard({ product }: ProductCardProps) {
  const { isInCart } = useCart()!;
  const { isFavorite, add, remove } = useUserFavorites()!;

  const {
    isOpen: isUnauthOpen,
    onOpen: onUnauthOpen,
    onOpenChange: onUanuthOpenChange,
  } = useDisclosure();

  const session = useSession();

  const url = `/catalogue/${product.article}`;
  const router = useRouter();

  const variants = product.variants;
  const [selected, setSelected] = useState(variants[0]);

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
        "flex gap-4 flex-col " +
        "bg-secondary rounded-sm py-[20px] text-secondary-foreground relative"
      }
    >
      <Button
        className={"absolute rounded-sm top-1 right-1 z-[2] text-3xl"}
        variant={"light"}
        color={"danger"}
        onPress={() => {
          if (!session.data?.user.id) {
            onUnauthOpen();
          }

          if (isFavorite(product.article)) {
            remove(product.article);
          } else {
            add(product.article);
          }
        }}
        isIconOnly
      >
        {isFavorite(product.article) ? <AiFillHeart /> : <AiOutlineHeart />}
      </Button>

      <div className={"relative overflow-clip px-[20px] "}>
        <Image
          className={"aspect-[290/329] object-cover"}
          src={
            selected.mediaUrls[0]
              ? selected.mediaUrls[0]?.url
              : "https://utfs.io/f/9f49f263-2475-45a1-8770-479fd5cb0c80-9w6i5v.png"
          }
          priority={true}
          placeholder={"blur"}
          blurDataURL={
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkeAoAAOsA57RxdOQAAAAASUVORK5CYII="
          }
          height={550}
          width={550}
          alt={product.name}
        />
      </div>

      <div className={"flex flex-col gap-2 px-[20px]"}>
        <Link href={url}>
          <h2 className={"font-semibold text-lg"}>{product.name}</h2>
        </Link>

        <div className={"flex items-start justify-between gap-2 -mt-1"}>
          <div className={"flex flex-col gap-2"}>
            <h2 className={"font-semibold flex gap-2"}>
              {product.compareAtPrice > product.price && (
                <>
                  <p className={"text-zinc-600 line-through"}>
                    {(Math.round(product.compareAtPrice * 100) / 100).toFixed(
                      2,
                    )}
                  </p>
                </>
              )}

              <> ₴{(Math.round(product.price * 100) / 100).toFixed(2)} UAH</>
            </h2>

            <div className={"flex gap-2 mt-2"}>
              {colors.map((color: any) => {
                return (
                  <Link
                    key={color.id}
                    href={`/catalogue/${product.article}?selectedColor=${color.id}`}
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
                  </Link>
                );
              })}
            </div>
          </div>

          <Link href={url}>
            <Button
              variant={"light"}
              className={"rounded-sm text-3xl"}
              color={"primary"}
              isIconOnly
            >
              {isInCart(selected.id) ? <BsBag /> : <BsBagCheck />}
            </Button>
          </Link>
        </div>
      </div>

      <UnauthorizedModal
        isOpen={isUnauthOpen}
        key={"no-auth-modal"}
        onOpenChange={onUanuthOpenChange}
      />
    </div>
  );
}
