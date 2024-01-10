"use server";

import { ProductSave, productSchema } from "@/schema/product/product-schema";
import prisma from "@/lib/prisma";
import { CategoryService } from "@/service/category/category-service";
import { Product } from "@prisma/client";
import { VariantSave } from "@/schema/product/variant-schema";

export async function _saveProduct(product: ProductSave) {
  var response: {
    errMsg: string | null;
    value: Product | null;
  };

  await prisma.$transaction(
    async () => {
      let exists = await prisma.product.count({
        where: { article: product.article },
      });

      response =
        exists !== 0
          ? await _updateProduct(product)
          : await _createProduct(product);
    },
    { timeout: 1000 * 20 },
  );

  //@ts-ignore
  return response;
}

async function _updateProduct(product: ProductSave) {
  if (!productSchema.safeParse(product)) {
    return {
      errMsg: "invalid data",
      value: null,
    };
  }

  const productUpdated = await prisma.product.update({
    where: { article: product.article },
    data: { ...product, variants: undefined, productCategories: undefined },
  });

  await _clearProductVariants(productUpdated.article);
  await _clearProductCategories(productUpdated.article);

  await _createProductVariants(product.variants, productUpdated.article);
  await _createProductCategories(product, productUpdated.article);

  return {
    errMsg: null,
    value: await prisma.product.findUnique({
      where: { article: productUpdated.article },
      include: {
        variants: true,
        productCategories: true,
      },
    }),
  };
}

async function _clearProductVariants(productArticle: string) {
  return prisma.variant.deleteMany({
    where: { productArticle },
  });
}

async function _clearProductCategories(productArticle: string) {
  return prisma.productCategory.deleteMany({
    where: { productArticle },
  });
}

async function _createProduct(product: ProductSave) {
  if (!productSchema.safeParse(product)) {
    return {
      errMsg: "invalid data",
      value: null,
    };
  }

  const productCreated = await prisma.product.create({
    data: { ...product, variants: undefined, productCategories: undefined },
  });

  await _createProductVariants(product.variants, productCreated.article);
  await _createProductCategories(product, productCreated.article);

  return {
    errMsg: null,
    value: await prisma.product.findUnique({
      where: { article: productCreated.article },
      include: {
        variants: true,
        productCategories: true,
      },
    }),
  };
}

async function _createProductCategories(
  product: ProductSave,
  productArticle: string,
) {
  const allCategories: any[] = [];

  for (const category of product.productCategories) {
    const value = (await CategoryService.instance.fetchById(category.id)).value;
    if (value) allCategories.push(value);
  }

  const categorySet = new Set(allCategories);

  for (const category of Array.from(categorySet)) {
    await prisma.productCategory.create({
      data: {
        productArticle,
        categoryId: category.id,
      },
    });
  }
}

async function _createProductVariants(
  variants: VariantSave[],
  productArticle: string,
) {
  for (const variant of variants) {
    await prisma.variant.create({
      data: {
        name: variant.name,
        quantity: variant.quantity,
        reserved: "reserved" in variant ? variant.reserved! : 0,
        productArticle: productArticle,
        colorId: variant.colorId,
        sizeId: variant.sizeId,
        mediaUrls: {
          create: variant.mediaUrls,
        },
      },
    });
  }
}
