"use server";

import { FetchFunctionProps } from "@/hooks/use-list";
import prisma from "@/lib/prisma";
import { convertSortDescriptorToPrisma } from "@/util/sort-descriptor-converter";
import { SortDirection } from "@react-types/shared";
import { Key } from "react";
import { _findChildren } from "@/app/dashboard/(pages)/categories/service/impl/category-util-service";

const CATEGORY_PAGE_SIZE = 10;

export async function _fetchAllCategories() {
  return prisma.category.findMany();
}

export async function _fetchCategoryById(id: number) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { parent: true },
  });

  return {
    errMsg: category ? null : "Could not find category with specified Id",
    value: category,
  };
}

export async function _fetchCategories({
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

  const items = await _findCategories(query, page, sortColumn, sortDirection);

  return {
    items,
    pages,
  };
}

export async function _fetchPossibleParents(id: number | undefined) {
  if (!id) {
    return prisma.category.findMany();
  }

  //todo: suka suka suka

  return prisma.category.findMany();
}

export async function _fetchCategoryTree() {
  const root = await prisma.category.findMany({
    where: {
      parentId: 0,
    },
    include: {
      children: true,
    },
  });

  for (let i = 0; i < root.length; i++) {
    root[i].children = await _findChildren(root[i].id);
  }

  return root;
}

async function _countPages(query: string) {
  const count = await prisma.category.count({
    where: {
      name: {
        contains: query,
      },
    },
  });
  return Math.ceil(count / CATEGORY_PAGE_SIZE);
}

async function _findCategories(
  query: string,
  page: number,
  sortColumn: Key,
  sortDirection: SortDirection,
) {
  const sortDir = convertSortDescriptorToPrisma(sortDirection);
  const orderBy = {};
  // @ts-ignore
  orderBy[sortColumn] = sortDir;

  return prisma.category.findMany({
    orderBy,
    take: CATEGORY_PAGE_SIZE,
    skip: (page - 1) * CATEGORY_PAGE_SIZE,
    where: {
      name: {
        contains: query,
      },
    },
    include: {
      parent: true,
    },
  });
}
