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

function _getWhere(query: string, status: string) {
  let statusFilter = {};
  if (Object.keys(OrderStatus).includes(status)) {
    statusFilter = {
      status: status,
    };
  }

  let nameFilter: { name: { search: string } } | {} = {};
  let emailFilter: { email: { search: string } } | {} = {};
  let phoneFilter: { phone: { search: string } } | {} = {};
  let surnameFilter: { surname: { search: string } } | {} = {};
  let middleNameFilter: { middlename: { search: string } } | {} = {};

  if (query && query.length > 0) {
    nameFilter = { name: { search: `${query}*` } };
    emailFilter = { email: { search: `${query}*` } };
    phoneFilter = { phone: { search: `${query}*` } };
    surnameFilter = { surname: { search: `${query}*` } };
    middleNameFilter = { middlename: { search: `${query}*` } };
  }

  const OR = [
    { ...nameFilter },
    { ...emailFilter },
    { ...phoneFilter },
    { ...surnameFilter },
    { ...middleNameFilter },
  ].filter((x) => Object.keys(x).length > 0);

  return {
    ...statusFilter,
    OR: OR.length > 0 ? OR : undefined,
  };
}

async function _countPages(query: string, status: string) {
  const count = await prisma.order.count({
    where: _getWhere(query, status),
  });
  console.log(count);
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

  return prisma.order.findMany({
    orderBy,
    take: ORDER_PAGE_SIZE,
    skip: (page - 1) * ORDER_PAGE_SIZE,
    where: _getWhere(query, status),
    include: {
      orderItems: true,
    },
  });
}
