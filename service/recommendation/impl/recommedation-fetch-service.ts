"use server";

import prisma from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";
import { TfIdf, TfIdfTerm } from "natural";
import fs from "fs";

const TFIDF_FILE_PATH = "./service/recommendation/impl/tfidf.json";

async function _fetchProducts() {
  return prisma.product.findMany({
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
}

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
    },
  });

  return products.map(
    (product) =>
      `${product.name} ${product.description} ${product.productCategories.map(
        (pc) => pc.category.name,
      )}`,
  );
}

async function _calculateTfIdf() {
  const strings = await _fetchProductStrings();

  const tfidf = new TfIdf();

  strings.forEach((str) => {
    tfidf.addDocument(str);
  });

  return tfidf;
}

async function _storeTfIdf(tfidf: TfIdf) {
  const data: TfIdfTerm[] = [];

  // @ts-ignore
  for (let i = 0; i < tfidf.documents?.length; i++) {
    tfidf.listTerms(i).forEach((item) => data.push(item));
  }

  const jsonData = JSON.stringify(data);
  fs.writeFileSync(TFIDF_FILE_PATH, jsonData);
}

export async function _precomputeTfIdf() {
  const tfIdf = await _calculateTfIdf();
  await _storeTfIdf(tfIdf);
}

async function _readTfIdf() {
  const jsonData = fs.readFileSync(TFIDF_FILE_PATH, "utf8");
  return JSON.parse(jsonData);
}

function _calculateCosineSimilarity(
  vectorA: Record<string, number>,
  vectorB: Record<string, number>,
) {
  let dotProduct = 0;
  for (const term in vectorA) {
    if (!vectorB.hasOwnProperty(term)) continue;
    dotProduct += vectorA[term] * vectorB[term];
  }

  const magnitudeA = Math.sqrt(
    Object.values(vectorA).reduce((acc, value) => acc + value ** 2, 0),
  );
  const magnitudeB = Math.sqrt(
    Object.values(vectorB).reduce((acc, value) => acc + value ** 2, 0),
  );

  return dotProduct / (magnitudeA * magnitudeB);
}

function _recommendProducts(
  productArticle: string,
  products: any[],
  tfIdfTerms: TfIdfTerm[],
) {
  const productIndex = products.findIndex(
    (product) => product.article === productArticle,
  );
  if (productIndex === -1) {
    throw new Error("Товар не знайдено!");
  }

  const recommendations: { product: any; similarity: number }[] = [];

  const givenProductVector: Record<string, number> = {};
  tfIdfTerms.forEach(({ term, tfidf }) => {
    givenProductVector[term] = tfidf;
  });

  products.forEach((product, index) => {
    if (index === productIndex) {
      return;
    }

    const otherProductVector: Record<string, number> = {};
    tfIdfTerms.forEach(({ term, tfidf }) => {
      otherProductVector[term] = tfidf;
    });

    const similarity = _calculateCosineSimilarity(
      givenProductVector,
      otherProductVector,
    );

    recommendations.push({ product, similarity });
  });

  recommendations.sort((a, b) => b.similarity - a.similarity);

  const N = 10; // Number of recommendations
  return recommendations.slice(0, N).map((item) => item.product);
}

export async function _fetchSimilar(productArticle: string) {
  const products = await _fetchProducts();
  const tfidfTerms = await _readTfIdf();

  return _recommendProducts(productArticle, products, tfidfTerms);
}
