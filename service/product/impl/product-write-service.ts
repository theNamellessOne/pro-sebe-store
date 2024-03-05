"use server";

import {
  createProductSchema,
  ProductCreate,
  ProductSave,
  productSchema,
} from "@/schema/product/product-schema";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
import { RecommendationService } from "@/service/recommendation/recommendation-service";
import { VariantSave } from "@/schema/product/variant-schema";

export async function _updateProduct(product: ProductSave) {
  if (!productSchema.safeParse(product)) {
    return { errMsg: "invalid data" };
  }
  const { article, ...rest } = product;

  await prisma.$transaction(
    async (prisma) => {
      await Promise.all([
        _clearProductSizeMeasurements(article),
        _clearProductCategories(article),
      ]);

      const categoriesPromise = prisma.productCategory.createMany({
        data: rest.productCategories.map((category) => {
          return { categoryId: category.id, productArticle: article };
        }),
      });

      const sizeMeasuresPromise = prisma.sizeMeasure.createMany({
        data: rest.sizeMeasures.map((sizeMeasure) => {
          return { ...sizeMeasure, productArticle: article };
        }),
      });

      const productPromise = prisma.product.update({
        where: { article: article },
        data: {
          ...rest,
          isDiscounted: rest.price < rest.compareAtPrice,
          variants: undefined,
          productCategories: undefined,
          sizeMeasures: undefined,
        },
      });

      await Promise.all([
        productPromise,
        categoriesPromise,
        sizeMeasuresPromise,
        _handleVariantsChange(product),
        RecommendationService.instance.precomputeTfIdf(),
      ]);
    },
    { timeout: 10000 },
  );

  return { errMsg: null };
}

async function _handleVariantsChange({
  article: productArticle,
  variants: uiVariants,
}: ProductSave) {
  const dbVariants = await prisma.variant.findMany({
    where: { productArticle },
  });

  const dbVariantsMap = new Map();
  dbVariants.forEach((variant) => {
    const key = `${variant.colorId}-${variant.sizeId}`;
    dbVariantsMap.set(key, variant);
  });
  const uiVariantsMap = new Map();
  uiVariants.forEach((variant) => {
    const key = `${variant.colorId}-${variant.sizeId}`;
    uiVariantsMap.set(key, variant);
  });

  const variantsWithId: VariantSave[] = [];
  const variantsToCreate: VariantSave[] = [];
  const variantsToUpdate: VariantSave[] = [];
  const variantsToRemove: VariantSave[] = [];

  uiVariantsMap.forEach((uiVariant, key) => {
    const dbVariant = dbVariantsMap.get(key);
    if (dbVariant) {
      const variant = { ...uiVariant, id: dbVariant.id };

      variantsWithId.push(variant);
      variantsToUpdate.push(variant);
    } else {
      const variant = { ...uiVariant, id: uuidv4() };

      variantsWithId.push(variant);
      variantsToCreate.push(variant);
    }
  });

  dbVariantsMap.forEach((dbVariant, key) => {
    if (!uiVariantsMap.has(key)) {
      variantsToRemove.push(dbVariant);
    }
  });

  await Promise.all([
    prisma.variant.deleteMany({
      where: {
        id: { in: variantsToRemove.map((variant) => variant.id!) },
      },
    }),

    prisma.variant.createMany({
      data: variantsToCreate.map((variant) => {
        return {
          id: variant.id as string,
          productArticle: productArticle,
          name: variant.name,
          quantity: variant.quantity,
          reserved: 0,
          colorId: variant.colorId,
          sizeId: variant.sizeId,
          mediaUrls: variant.mediaUrls,
        };
      }),
    }),
  ]);

  const variantsUpdatePromises = variantsToUpdate.map((variant) => {
    return prisma.variant.update({
      where: { id: variant.id },
      data: { quantity: variant.quantity },
    });
  });

  await Promise.all(variantsUpdatePromises);
}

async function _clearProductSizeMeasurements(productArticle: string) {
  return prisma.sizeMeasure.deleteMany({
    where: { product: { article: productArticle } },
  });
}

async function _clearProductCategories(productArticle: string) {
  return prisma.productCategory.deleteMany({
    where: { productArticle },
  });
}

export async function _createProduct(product: ProductCreate) {
  if (!createProductSchema.safeParse(product)) {
    return {
      errMsg: "invalid data",
      value: null,
    };
  }

  try {
    return {
      errMsg: null,
      value: await prisma.product.create({
        data: {
          article: product.article,
          name: "",
          description: "",
          price: 0,
          compareAtPrice: 0,
          status: "DRAFT",
        },
      }),
    };
  } catch (err) {
    return { errMsg: String(err), value: null };
  }
}
