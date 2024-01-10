"use server";

import prisma from "@/lib/prisma";
import { FetchFunctionProps } from "@/hooks/use-list";
import { convertSortDescriptorToPrisma } from "@/util/sort-descriptor-converter";
import { SortDirection } from "@react-types/shared";

import { Key } from "react";

const COLOR_PAGE_SIZE = 10;

export async function _fetchBannerById(id: number) {
  const banner = await prisma.banner.findUnique({ where: { id } });

  return {
    errMsg: banner ? null : "Could not find banner with specified Id",
    value: banner,
  };
}

export async function _fetchAllBanners() {
  return prisma.banner.findMany();
}

export async function _fetchBanners({
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

  const items = await _findBanners(query, page, sortColumn, sortDirection);

  return {
    items,
    pages,
  };
}

async function _countPages(query: string) {
  const count = await prisma.banner.count({
    where: {
      name: {
        contains: query,
      },
    },
  });
  return Math.ceil(count / COLOR_PAGE_SIZE);
}

async function _findBanners(
  query: string,
  page: number,
  sortColumn: Key,
  sortDirection: SortDirection,
) {
  const sortDir = convertSortDescriptorToPrisma(sortDirection);
  const orderBy = {};
  // @ts-ignore
  orderBy[sortColumn] = sortDir;

  return prisma.banner.findMany({
    orderBy,
    take: COLOR_PAGE_SIZE,
    skip: (page - 1) * COLOR_PAGE_SIZE,
    where: {
      name: {
        contains: query,
      },
    },
  });
}
