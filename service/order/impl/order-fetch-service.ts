"use server";

import { FetchFunctionProps } from "@/hooks/use-list";
import prisma from "@/lib/prisma";
import { convertSortDescriptorToPrisma } from "@/util/sort-descriptor-converter";
import { SortDirection } from "@react-types/shared";
import { Key } from "react";
import { OrderStatus } from "@prisma/client";

const ORDER_PAGE_SIZE = 10;

export async function _fetchOrders({
  query,
  page,
  sortColumn,
  sortDirection,
  status,
}: FetchFunctionProps & { status: string }) {
  console.log(Object.keys(OrderStatus));
  console.log({ status });
  console.log(Object.keys(OrderStatus).includes(status));
  const pages = await _countPages(query, status);
  if (page < 0 || page > pages) {
    return {
      items: [],
      pages,
    };
  }

  const items = await _findOrders(
    query,
    page,
    sortColumn,
    sortDirection,
    status,
  );

  return {
    items,
    pages,
  };
}

async function _countPages(query: string, status: string) {
  let statusFilter = {};
  if (Object.keys(OrderStatus).includes(status)) {
    statusFilter = {
      status: status,
    };
  }

  const count = await prisma.order.count({
    where: {
      ...statusFilter,
      OR: [
        { name: { contains: query } },
        { email: { contains: query } },
        { surname: { contains: query } },
        { middlename: { contains: query } },
        { phone: { contains: query } },
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
  status: string,
) {
  const sortDir = convertSortDescriptorToPrisma(sortDirection);
  const orderBy = {};
  // @ts-ignore
  orderBy[sortColumn] = sortDir;

  let statusFilter = {};
  if (Object.keys(OrderStatus).includes(status)) {
    statusFilter = {
      status: status,
    };
  }

  return prisma.order.findMany({
    orderBy,
    take: ORDER_PAGE_SIZE,
    skip: (page - 1) * ORDER_PAGE_SIZE,
    where: {
      ...statusFilter,
      OR: [
        {
          name: { contains: query },
          surname: { contains: query },
          middlename: { contains: query },
          email: { contains: query },
          phone: { contains: query },
          orderItems: {
            some: {
              variantName: { contains: query },
              productName: { contains: query },
            },
          },
        },
      ],
    },
    include: {
      orderItems: true,
    },
  });
}
