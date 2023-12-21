"use server";

import { ProductCreate, productSchema } from "@/schema/product-schema";
import prisma from "@/lib/prisma";

export async function saveProduct(
  product: ProductCreate,
  id: number | undefined,
) {
  return createProduct(product);
}

async function createProduct(product: ProductCreate) {
  if (!productSchema.safeParse(product)) {
    return {
      errMsg: "invalid data",
      value: null,
    };
  }

  const item = await prisma.product.create({
    data: { ...product, variants: undefined },
  });

  const variants = [];
  for (const variant of product.variants) {
    await prisma.variant.create({
      data: {
        quantity: 0,
        reserved: 0,
        productId: item.id,
        colorVariants: {
          create: { colorId: variant.colorId },
        },
        sizeVariants: {
          create: { sizeId: variant.sizeId },
        },
      },
    });
  }

  return {
    errMsg: null,
    value: await prisma.product.findUnique({
      where: { id: item.id },
      include: {
        variants: true,
        productCategories: true,
      },
    }),
  };
}
