"use server";

import { FetchFunctionProps } from "@/hooks/use-list";
import prisma from "@/lib/prisma";
import { convertSortDescriptorToPrisma } from "@/util/sort-descriptor-converter";
import { SortDirection } from "@react-types/shared";
import { Key } from "react";

const ORDER_PAGE_SIZE = 10;

export async function _fetchOrders({
  query,
  page,
  sortColumn,
  sortDirection,
}: FetchFunctionProps) {
  console.log("start");
  const pages = await _countPages(query);
  console.log(pages);
  if (page < 0 || page > pages) {
    return {
      items: [],
      pages,
    };
  }

  const items = await _findOrders(query, page, sortColumn, sortDirection);
  console.log(items);

  return {
    items,
    pages,
  };
}

async function _countPages(query: string) {
  const count = await prisma.order.count({
    where: {
      OR: [
        {
          orderItems: {
            some: {
              variantName: { contains: query },
              productName: { contains: query },
            },
          },
        },
      ],
    },
  });
  return Math.ceil(count / ORDER_PAGE_SIZE);
}

async function _findOrders(
  query: string,
  page: number,
  sortColumn: Key,
  sortDirection: SortDirection,
) {
  const sortDir = convertSortDescriptorToPrisma(sortDirection);
  const orderBy = {};
  // @ts-ignore
  orderBy[sortColumn] = sortDir;

  return prisma.order.findMany({
    orderBy,
    take: ORDER_PAGE_SIZE,
    skip: (page - 1) * ORDER_PAGE_SIZE,
    where: {
      OR: [
        {
          orderItems: {
            some: {
              variantName: { contains: query },
              productName: { contains: query },
            },
          },
        },
      ],
    },
  });
}
