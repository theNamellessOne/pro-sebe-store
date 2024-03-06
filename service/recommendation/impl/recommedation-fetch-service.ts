"use server";

import prisma from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";


export async function _fetchSimilar(article: string) {
  let start = Date.now();
  //@ts-ignore
  const articles: string = await recommender.recommend(
    process.env.DATABASE_URL,
    article,
  );

  const products = await prisma.product.findMany({
    where: {
      status: ProductStatus.ACTIVE,
      variants: {
        some: { quantity: { gt: 0 } },
      },
      article: {
        in: articles.split(" "),
      },
    },
    include: {
      variants: true,
    },
  });

  console.log(articles);
  console.log("time :", Date.now() - start);

  return products;
}
