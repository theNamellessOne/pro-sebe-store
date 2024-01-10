"use server";

import prisma from "@/lib/prisma";
import { FetchFunctionProps } from "@/hooks/use-list";
import { Key } from "react";
import { SortDirection } from "@react-types/shared";
import { convertSortDescriptorToPrisma } from "@/util/sort-descriptor-converter";

const PRODUCT_PAGE_SIZE = 10;

export async function _fetchAllProducts() {
  return prisma.product.findMany();
}

export async function _fetchProducts({
  query,
  page,
  sortColumn,
  sortDirection,
}: FetchFunctionProps) {
  const pages = await _countPages(query);
  if (page < 0 || page > pages) {
    return {
      items: [],
      pages,
    };
  }

  const items = await _findProducts(query, page, sortColumn, sortDirection);

  return {
    items,
    pages,
  };
}

async function _countPages(query: string) {
  const count = await prisma.product.count({
    where: {
      OR: [{ article: { contains: query } }, { name: { contains: query } }],
    },
  });
  return Math.ceil(count / PRODUCT_PAGE_SIZE);
}

async function _findProducts(
  query: string,
  page: number,
  sortColumn: Key,
  sortDirection: SortDirection,
) {
  const sortDir = convertSortDescriptorToPrisma(sortDirection);
  const orderBy = {};
  // @ts-ignore
  orderBy[sortColumn] = sortDir;

  return prisma.product.findMany({
    orderBy,
    take: PRODUCT_PAGE_SIZE,
    skip: (page - 1) * PRODUCT_PAGE_SIZE,
    where: {
      OR: [{ article: { contains: query } }, { name: { contains: query } }],
    },
  });
}

export async function _fetchProductById(article: string) {
  const product = await prisma.product.findUnique({
    where: { article },
    include: {
      productCategories: true,
      variants: {
        include: {
          mediaUrls: true,
        },
      },
    },
  });

  return {
    errMsg: product ? null : "Could not find product with specified Article",
    value: product,
  };
}
