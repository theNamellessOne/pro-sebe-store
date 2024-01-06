"use server";

import prisma from "@/lib/prisma";
import { FetchFunctionProps } from "@/hooks/use-list";
import { convertSortDescriptorToPrisma } from "@/util/sort-descriptor-converter";
import { Key } from "react";
import { SortDirection } from "@react-types/shared";

const SIZE_PAGE_SIZE = 10;

export async function _fetchSizeById(id: number) {
  const size = await prisma.size.findUnique({ where: { id } });

  return {
    errMsg: size ? null : "Could not find size with specified Id",
    value: size,
  };
}

export async function _fetchAllSizes() {
  return prisma.size.findMany();
}

export async function _fetchSizes({
  query,
  page,
  sortColumn,
  sortDirection,
}: FetchFunctionProps) {
  const pages = await _countPages(query);
  if (page < 0 || pages === 0 || page > pages) {
    return {
      items: [],
      pages,
    };
  }

  const items = await _findSizes(query, page, sortColumn, sortDirection);

  return {
    items,
    pages,
  };
}

async function _countPages(query: string) {
  const count = await prisma.size.count({
    where: {
      name: {
        contains: query,
      },
    },
  });
  return Math.ceil(count / SIZE_PAGE_SIZE);
}

async function _findSizes(
  query: string,
  page: number,
  sortColumn: Key,
  sortDirection: SortDirection,
) {
  const sortDir = convertSortDescriptorToPrisma(sortDirection);
  const orderBy = {};
  // @ts-ignore
  orderBy[sortColumn] = sortDir;

  return prisma.size.findMany({
    orderBy,
    take: SIZE_PAGE_SIZE,
    skip: (page - 1) * SIZE_PAGE_SIZE,
    where: {
      name: {
        contains: query,
      },
    },
  });
}