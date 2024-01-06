import prisma from "@/lib/prisma";

const PRODUCT_PAGE_SIZE = 10;

export async function _fetchProductById(article: string) {
  const product = await prisma.product.findUnique({
    where: { article },
    include: {
      productCategories: true,
      variants: true,
    },
  });

  return {
    errMsg: product ? null : "Could not find product with specified Article",
    value: product,
  };
}
