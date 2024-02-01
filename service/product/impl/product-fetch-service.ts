"use server";

import prisma from "@/lib/prisma";
import { FetchFunctionProps } from "@/hooks/use-list";
import { Key } from "react";
import { SortDirection } from "@react-types/shared";
import { convertSortDescriptorToPrisma } from "@/util/sort-descriptor-converter";
import { ProductStatus } from "@prisma/client";
import { PriceFilter } from "@/app/(client)/catalogue/types/product-filter";

const PRODUCT_PAGE_SIZE = 10;

export async function _fetchAllProducts() {
  return prisma.product.findMany();
}

export async function _fetchPriceExtremes() {
  const e = await prisma.product.aggregate({
    _max: { price: true },
    _min: { price: true },
  });

  return {
    max: e._max.price!,
    min: e._min.price!,
  };
}

export async function _fetchSimilarProducts(article: string) {
  const product = await prisma.product.findUnique({
    where: { article },
    include: { productCategories: true },
  });

  if (!product) {
    return {
      errMsg: "could not find product with specified id",
      value: null,
    };
  }

  return {
    errMsg: null,
    value: await prisma.product.findMany({
      take: 10,
      where: {
        NOT: { article: product.article },
        status: "ACTIVE",
        variants: {
          some: { quantity: { gt: 0 } },
        },
        productCategories: {
          some: {
            categoryId: {
              in: product.productCategories.map((pc) => pc.categoryId),
            },
          },
        },
      },
      include: {
        productCategories: true,
        variants: {
          include: { mediaUrls: true },
        },
      },
    }),
  };
}

async function _getWhereClause({
  query,
  price,
  sizes,
  colors,
}: {
  query: string;
  sizes: number[];
  colors: number[];
  price: PriceFilter;
}) {
  const priceFilter = {
    lte: price.max == -1 ? Number.MAX_SAFE_INTEGER : price.max,
    gte: price.min == -1 ? Number.MIN_SAFE_INTEGER : price.min,
  };

  let sizeFilter: { in: number[] } | { gte: number };
  if (sizes.length > 0) sizeFilter = { in: sizes };
  else sizeFilter = { gte: 0 };

  let colorsFilter: { in: number[] } | { gte: number };
  if (colors.length > 0) colorsFilter = { in: colors };
  else colorsFilter = { gte: 0 };

  return {
    name: { contains: query },
    status: { equals: ProductStatus.ACTIVE },
    variants: {
      some: {
        quantity: { gt: 0 },
        sizeId: sizeFilter,
        colorId: colorsFilter,
      },
    },
    price: priceFilter,
  };
}

export async function _fetchAndFilter(
  props: FetchFunctionProps & {
    sizes: number[];
    colors: number[];
    price: PriceFilter;
  },
) {
  const whereClause = await _getWhereClause({ ...props });
  const count = await prisma.product.count({
    where: whereClause,
  });
  const pages = Math.ceil(count / PRODUCT_PAGE_SIZE);

  if (props.page < 0 || props.page > pages) {
    return {
      items: [],
      pages,
    };
  }

  const sortDir = convertSortDescriptorToPrisma(props.sortDirection);
  const orderBy = {};
  // @ts-ignore
  orderBy[props.sortColumn] = sortDir;

  const items = await prisma.product.findMany({
    take: PRODUCT_PAGE_SIZE,
    skip: (props.page - 1) * PRODUCT_PAGE_SIZE,
    orderBy: orderBy,
    where: whereClause,
    include: {
      variants: {
        include: {
          color: true,
          mediaUrls: true,
        },
      },
    },
  });

  return {
    items,
    pages,
  };
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
          color: true,
          size: true,
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
