"use server";

import { ProductCreate, productSchema } from "@/schema/product-schema";
import prisma from "@/lib/prisma";
import { fetchCategoryById } from "@/service/category-service";

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
    data: { ...product, variants: undefined, productCategories: undefined },
  });

  await createProductVariants(product, item.id);
  await createProductCategories(product, item.id);

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

async function createProductCategories(
  product: ProductCreate,
  productId: number,
) {
  const allCategories: any[] = [];

  for (const category of product.productCategories) {
    const value = (await fetchCategoryById(category.id)).value;
    if (value) allCategories.push(value);
  }

  const categorySet = new Set(allCategories);

  for (const category of Array.from(categorySet)) {
    await prisma.productCategory.create({
      data: {
        productId,
        categoryId: category.id,
      },
    });
  }
}

async function createProductVariants(
  product: ProductCreate,
  productId: number,
) {
  for (const variant of product.variants) {
    await prisma.variant.create({
      data: {
        quantity: 0,
        reserved: 0,
        productId: productId,
        colorVariants: {
          create: { colorId: variant.colorId },
        },
        sizeVariants: {
          create: { sizeId: variant.sizeId },
        },
      },
    });
  }
}
