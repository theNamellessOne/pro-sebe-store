import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useProduct(product: any) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  const [selectedValues, setSelectedValues] = useState({
    colorId: -1,
    sizeId: -1,
  });

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const changeSelectedValues = ({
    colorId,
    sizeId,
  }: {
    colorId: number;
    sizeId: number;
  }) => {
    if (colorId === -1) colorId = product.variants[0].colorId;
    if (sizeId === -1) sizeId = product.variants[0].sizeId;

    const sv = product.variants.filter(
      (variant: any) =>
        variant.colorId === colorId && variant.sizeId === sizeId,
    )[0];

    setSelectedValues({ colorId, sizeId });
    setSelectedVariant(sv);
  };

  const readSelectedParam = () => {
    let selectedColorParam = searchParams.get("selectedColor") ?? -1;
    const selectedSizeParam = searchParams.get("selectedSize") ?? -1;

    return [+selectedColorParam, +selectedSizeParam] as const;
  };

  const setSelectedColor = (colorId: number) => {
    const params = new URLSearchParams(searchParams);
    if (colorId) {
      params.set("selectedColor", colorId.toString());
      changeSelectedValues({ ...selectedValues, colorId });
    } else {
      params.delete("selectedColor");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const setSelectedSize = (sizeId: number) => {
    const params = new URLSearchParams(searchParams);
    if (sizeId) {
      params.set("selectedSize", sizeId.toString());
      changeSelectedValues({ ...selectedValues, sizeId });
    } else {
      params.delete("selectedSize");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const [colorId, sizeId] = readSelectedParam();

    changeSelectedValues({
      colorId,
      sizeId,
    });
  }, []);

  return { selectedVariant, setSelectedSize, setSelectedColor };
}
