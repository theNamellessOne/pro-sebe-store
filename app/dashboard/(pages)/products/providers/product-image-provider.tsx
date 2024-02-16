import { ProductSave } from "@/schema/product/product-schema";
import { ReactNode, createContext, useEffect, useState } from "react";

export const ProductImageContext = createContext<
  ProductImageContext | undefined
>(undefined);

type ProductImageContext = {
  urls: string[];
  addUrls: (url: string[]) => void;
};

type ProductImageProps = {
  product: ProductSave;
  children: ReactNode;
};

export function ProductImageProvider({ children, product }: ProductImageProps) {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    const uniqueUrls = new Set(
      product?.variants.flatMap((variant) =>
        variant.mediaUrls.map(({ url }) => url),
      ),
    );

    setUrls(Array.from(uniqueUrls));
  }, []);

  const addUrls = (newUrls: string[]) => {
    setUrls([...urls, ...newUrls]);
  };

  return (
    <ProductImageContext.Provider value={{ urls, addUrls }}>
      {children}
    </ProductImageContext.Provider>
  );
}
