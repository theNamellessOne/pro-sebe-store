"use server";

import prisma from "@/lib/prisma";
import { FetchFunctionProps } from "@/hooks/use-list";
import { Key } from "react";
import { SortDirection } from "@react-types/shared";
import { convertSortDescriptorToPrisma } from "@/util/sort-descriptor-converter";
import { ProductStatus } from "@prisma/client";
import { PriceFilter } from "@/app/(client)/catalogue/types/product-filter";

const PRODUCT_PAGE_SIZE = 12;

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

async function _getWhereClause({
  query,
  price,
  sizes,
  colors,
  categories,
  isDiscounted,
}: {
  query: string;
  price: PriceFilter;
  sizes: number[];
  colors: number[];
  categories: number[];
  isDiscounted: boolean;
}) {
  let priceFilter: { price: { lte: number; gte: number } } | {};
  priceFilter = {
    price: {
      lte: price.max == -1 ? Number.MAX_SAFE_INTEGER : price.max,
      gte: price.min == -1 ? Number.MIN_SAFE_INTEGER : price.min,
    },
  };

  let sizeFilter: { sizeId: { in: number[] } } | {} = {};
  if (sizes.length > 0) sizeFilter = { sizeId: { in: sizes } };

  let colorsFilter: { colorId: { in: number[] } } | {} = {};
  if (colors.length > 0) colorsFilter = { colorId: { in: colors } };

  let nameFilter: { name: { search: string } } | {} = {};
  if (query && query.length > 0) nameFilter = { name: { search: `${query}*` } };

  let articleFilter: { article: { search: string } } | {} = {};
  if (query && query.length > 0)
    articleFilter = { article: { search: `${query}*` } };

  let descriptionFilter: { description: { search: string } } | {} = {};
  if (query && query.length > 0)
    descriptionFilter = { description: { search: `${query}*` } };

  let categoryFilter: { categoryId: { in: number[] } } | {} = {};
  if (categories.length > 0)
    categoryFilter = { categoryId: { in: categories } };

  const OR = [
    { ...nameFilter },
    { ...descriptionFilter },
    { ...articleFilter },
  ].filter((x) => Object.keys(x).length > 0);

  return {
    OR: OR.length > 0 ? OR : undefined,
    status: { equals: ProductStatus.ACTIVE },
    isDiscounted: isDiscounted ? true : undefined,
    productCategories: {
      some: { ...categoryFilter },
    },
    variants: {
      some: {
        quantity: { gt: 0 },
        ...sizeFilter,
        ...colorsFilter,
      },
    },
    ...priceFilter,
  };
}

export async function _fetchAndFilter(
  props: FetchFunctionProps & {
    sizes: number[];
    colors: number[];
    price: PriceFilter;
    categories: number[];
    isDiscounted: boolean;
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
    where: _getDashboardWhere(query),
  });
  return Math.ceil(count / PRODUCT_PAGE_SIZE);
}

function _getDashboardWhere(query: string) {
  let nameFilter: { name: { search: string } } | {} = {};
  if (query && query.length > 0) nameFilter = { name: { search: `${query}*` } };

  let descriptionFilter: { description: { search: string } } | {} = {};
  if (query && query.length > 0)
    descriptionFilter = { description: { search: `${query}*` } };

  let articleFilter: { article: { search: string } } | {} = {};
  if (query && query.length > 0)
    articleFilter = { article: { search: `${query}*` } };

  const OR = [
    { ...nameFilter },
    { ...descriptionFilter },
    { ...articleFilter },
  ].filter((x) => Object.keys(x).length > 0);

  return { OR: OR.length > 0 ? OR : undefined };
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
    where: _getDashboardWhere(query),
  });
}

export async function _fetchProductById(article: string) {
  const product = await prisma.product.findUnique({
    where: { article },
    include: {
      sizeMeasures: true,
      productCategories: true,
      variants: {
        include: {
          color: true,
          size: true,
        },
      },
    },
  });

  return {
    errMsg: product ? null : "Could not find product with specified Article",
    value: product,
  };
}
