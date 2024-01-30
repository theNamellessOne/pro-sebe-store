import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useProduct() {
  const [selectedValues, setSelectedValues] = useState({
    colorId: -1,
    sizeId: -1,
  });

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const readSelectedParam = () => {
    let selectedColorParam = searchParams.get("selectedColor") ?? -1;
    const selectedSizeParam = searchParams.get("selectedSize") ?? -1;

    return [+selectedColorParam, +selectedSizeParam] as const;
  };

  const setSelectedColor = (colorId: number) => {
    const params = new URLSearchParams(searchParams);
    if (colorId) {
      params.set("selectedColor", colorId.toString());
      setSelectedValues({ ...selectedValues, colorId });
    } else {
      params.delete("selectedColor");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const setSelectedSize = (sizeId: number) => {
    const params = new URLSearchParams(searchParams);
    if (sizeId) {
      params.set("selectedSize", sizeId.toString());
      setSelectedValues({ ...selectedValues, sizeId });
    } else {
      params.delete("selectedSize");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const [colorId, sizeId] = readSelectedParam();

    setSelectedValues({
      colorId,
      sizeId,
    });
  }, []);

  return { selectedValues, setSelectedSize, setSelectedColor };
}
