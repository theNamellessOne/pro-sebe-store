"use server";

import prisma from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";
import { TfIdf } from "natural";

async function _fetchProductStrings() {
  const products = await prisma.product.findMany({
    where: {
      status: ProductStatus.ACTIVE,
      variants: {
        some: { quantity: { gt: 0 } },
      },
    },
    include: {
      productCategories: {
        include: { category: true },
      },
      variants: {
        include: {
          mediaUrls: true,
        },
      },
    },
  });

  const strings = products.map(
    (product) =>
      `${product.name} ${product.description} ${product.productCategories.map((pc) => pc.category.name)}`,
  );

  return { products, strings };
}

async function _calculateTfIdf() {
  const { products, strings } = await _fetchProductStrings();

  const tfidf = new TfIdf();

  strings.forEach((str) => {
    tfidf.addDocument(str);
  });

  return { products, tfidf };
}

function _calculateCosineSimilarity(
  vectorA: Record<string, number>,
  vectorB: Record<string, number>,
) {
  let dotProduct = 0;
  for (const term in vectorA) {
    if (vectorB.hasOwnProperty(term)) {
      dotProduct += vectorA[term] * vectorB[term];
    }
  }

  const magnitudeA = Math.sqrt(
    Object.values(vectorA).reduce((acc, value) => acc + value ** 2, 0),
  );
  const magnitudeB = Math.sqrt(
    Object.values(vectorB).reduce((acc, value) => acc + value ** 2, 0),
  );

  const similarity = dotProduct / (magnitudeA * magnitudeB);
  return similarity;
}

function _recommendProducts(
  productArticle: string,
  products: any[],
  tfidf: TfIdf,
) {
  const productIndex = products.findIndex(
    (product) => product.article === productArticle,
  );
  if (productIndex === -1) {
    throw new Error("Product not found");
  }

  const recommendations: { product: any; similarity: number }[] = [];

  const givenProductVector: Record<string, number> = {};
  //@ts-ignore
  tfidf.listTerms(productIndex).forEach(({ term, tfidfValue }) => {
    givenProductVector[term] = tfidfValue;
  });

  products.forEach((product, index) => {
    if (index !== productIndex) {
      const otherProductVector: Record<string, number> = {};
      //@ts-ignore
      tfidf.listTerms(index).forEach(({ term, tfidfValue }) => {
        otherProductVector[term] = tfidfValue;
      });

      const similarity = _calculateCosineSimilarity(
        givenProductVector,
        otherProductVector,
      );

      recommendations.push({ product, similarity });
    }
  });

  recommendations.sort((a, b) => b.similarity - a.similarity);

  const N = 5; // Number of recommendations
  return recommendations.slice(0, N).map((item) => item.product);
}

export async function _fetchSimilar(productArticle: string) {
  const { products, tfidf } = await _calculateTfIdf();

  return _recommendProducts(productArticle, products, tfidf);
}
