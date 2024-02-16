import Link from "next/link";
import { ColorList } from "./color-list";
import { SizeList } from "./size-list";
import { Button } from "@/app/(client)/components/ui/button";
import { Ruler } from "lucide-react";
import { useCart } from "@/app/(client)/cart/hooks/use-cart";

export function ProductInfo({
  product,
  selectedVariant,
  setSelectedColor,
  setSelectedSize,
}: {
  product: any;
  selectedVariant: any;
  setSelectedColor: (colorId: number) => void;
  setSelectedSize: (sizeId: number) => void;
}) {
  const { isInCart, addToCart } = useCart()!;

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

  const getQuantityMessage = () => {
    const { quantity } = selectedVariant;

    if (quantity <= 0) return <p className={"capitalize"}>не в наявності</p>;
    if (quantity >= 10) return <p className={"capitalize"}>в наявності</p>;
    if (quantity <= 10)
      return <p className={"text-warning capitalize"}>закінчується</p>;
  };

  return (
    <div className={"flex flex-col gap-6"}>
      <div className={"flex flex-col gap-2"}>
        <h2 className={"text-xl md:text-2xl"}>{product.name}</h2>
        <h3 className={"text-lg xl:text-xl flex gap-2"}>
          {product.compareAtPrice > product.price && (
            <>
              <p className={"text-zinc-600 line-through"}>
                {(Math.round(product.compareAtPrice * 100) / 100).toFixed(2)}
              </p>
            </>
          )}

          <> {(Math.round(product.price * 100) / 100).toFixed(2)} UAH</>
        </h3>
      </div>

      <ColorList
        colors={colors}
        colorId={selectedVariant.colorId}
        setSelectedColor={setSelectedColor}
      />

      <div className={"flex flex-col gap-2"}>
        <h3 className={"text-lg xl:text-xl"}>Опис товару</h3>
        <p>{product.description}</p>
      </div>

      <SizeList
        sizes={sizes}
        sizeId={selectedVariant.sizeId}
        setSelectedSize={setSelectedSize}
      />

      <h3>{getQuantityMessage()}</h3>

      <Link href={"/"} className={"flex gap-2 font-semibold"}>
        <Ruler />
        Перевір свій розмір.
      </Link>

      <Button
        disabled={!isInCart(selectedVariant.id)}
        type="primary"
        className={"font-semibold w-fit"}
        onClick={() => addToCart(selectedVariant.id)}
      >
        {!isInCart(selectedVariant.id) ? "ВЖЕ У КОШИКУ" : "ДОДАТИ У КОШИК"}
      </Button>
    </div>
  );
}
