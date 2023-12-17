"use server";

import prisma from "@/lib/prisma";
import { convertSortDescriptorToPrisma } from "@/util/sort-descriptor-converter";

import { FetchFunctionProps } from "@/hooks/use-list";
import { SizeCreate, sizeSchema } from "@/schema/size-schema";

const COLOR_PAGE_SIZE = 10;

export async function fetchSizeById(id: number) {
  const size = await prisma.size.findUnique({ where: { id } });

  return {
    errMsg: size ? null : "Could not find size with specified Id",
    value: size,
  };
}

export async function fetchSizes({
  query,
  page,
  sortColumn,
  sortDirection,
}: FetchFunctionProps) {
  async function countPages() {
    const count = await prisma.size.count({
      where: {
        name: {
          contains: query,
        },
      },
    });
    return Math.ceil(count / COLOR_PAGE_SIZE);
  }

  const pages = await countPages();
  if (page < 0 || pages === 0 || page > pages) {
    return {
      items: [],
      pages,
    };
  }

  async function findSizes() {
    const sortDir = convertSortDescriptorToPrisma(sortDirection);
    const orderBy = {};
    // @ts-ignore
    orderBy[sortColumn] = sortDir;

    return prisma.size.findMany({
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

  const items = await findSizes();

  return {
    items,
    pages,
  };
}

export async function saveSize(size: SizeCreate, id: number | undefined) {
  return id ? updateSize(id, size) : createSize(size);
}

async function createSize(size: SizeCreate) {
  if (!sizeSchema.safeParse(size)) {
    return {
      errMsg: "invalid data",
      value: null,
    };
  }

  return {
    errMsg: null,
    value: await prisma.size.create({ data: size }),
  };
}

async function updateSize(id: number, size: SizeCreate) {
  if (!sizeSchema.safeParse(size)) {
    return {
      errMsg: "invalid data",
      value: null,
    };
  }

  return {
    errMsg: null,
    value: await prisma.size.update({
      where: { id },
      data: size,
    }),
  };
}
