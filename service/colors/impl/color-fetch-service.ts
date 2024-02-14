"use server";

import prisma from "@/lib/prisma";
import { FetchFunctionProps } from "@/hooks/use-list";
import { convertSortDescriptorToPrisma } from "@/util/sort-descriptor-converter";
import { SortDirection } from "@react-types/shared";

import { Key } from "react";

const COLOR_PAGE_SIZE = 10;

export async function _fetchColorById(id: number) {
  const color = await prisma.color.findUnique({ where: { id } });

  return {
    errMsg: color ? null : "Could not find color with specified Id",
    value: color,
  };
}

export async function _fetchAllColors() {
  return prisma.color.findMany();
}

export async function _fetchColors({
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

  const items = await _findColors(query, page, sortColumn, sortDirection);

  return {
    items,
    pages,
  };
}

function _getWhere(query: string | undefined) {
  let search: { search: string } | undefined;
  if (query && query.length > 0) search = { search: `${query}*` };

  return { name: { ...search } };
}

async function _countPages(query: string) {
  const count = await prisma.color.count({
    where: _getWhere(query),
  });
  return Math.ceil(count / COLOR_PAGE_SIZE);
}

async function _findColors(
  query: string,
  page: number,
  sortColumn: Key,
  sortDirection: SortDirection,
) {
  const sortDir = convertSortDescriptorToPrisma(sortDirection);
  const orderBy = {};
  // @ts-ignore
  orderBy[sortColumn] = sortDir;

  return prisma.color.findMany({
    orderBy,
    take: COLOR_PAGE_SIZE,
    skip: (page - 1) * COLOR_PAGE_SIZE,
    where: _getWhere(query),
  });
}
