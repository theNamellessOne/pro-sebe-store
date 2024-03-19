"use client";

import { useQuery } from "@tanstack/react-query";
import { useProduct } from "../hooks/use-product";
import { ProductImg } from "./product-img";
import { ProductInfo } from "./product-info";
import { SimilarProducts } from "./similar-products";
import { ProductService } from "@/service/product/product-service";
import { useRouter } from "next/router";

export function Product(props: { article: string }) {
  const query = useQuery({
    queryKey: ["product", props.article],
    queryFn: () => ProductService.instance.fetchById(props.article),
  });

  const product = query.data?.value;

  if (!product) {
    return useRouter().replace("/catalogue");
  }

  const { selectedVariant, setSelectedColor, setSelectedSize } =
    useProduct(product);

  return (
    <div className={"container mx-auto flex flex-col gap-8"}>
      <div className={"flex flex-col lg:flex-row gap-6 lg:gap-12 p-4"}>
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

      <SimilarProducts article={product.article} />
    </div>
  );
}
