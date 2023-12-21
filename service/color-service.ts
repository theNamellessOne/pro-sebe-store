"use server";

import prisma from "@/lib/prisma";
import { ColorCreate, colorSchema } from "@/schema/color-schema";
import { convertSortDescriptorToPrisma } from "@/util/sort-descriptor-converter";
import { FetchFunctionProps } from "@/hooks/use-list";

const COLOR_PAGE_SIZE = 10;

export async function fetchColorById(id: number) {
  const color = await prisma.color.findUnique({ where: { id } });

  return {
    errMsg: color ? null : "Could not find color with specified Id",
    value: color,
  };
}

export async function fetchAllColors() {
  return prisma.color.findMany();
}

export async function fetchColors({
  query,
  page,
  sortColumn,
  sortDirection,
}: FetchFunctionProps) {
  async function countPages() {
    const count = await prisma.color.count({
      where: {
        name: {
          contains: query,
        },
      },
    });
    return Math.ceil(count / COLOR_PAGE_SIZE);
  }

  const pages = await countPages();
  if (page < 0 || page > pages) {
    return {
      items: [],
      pages,
    };
  }

  async function findColors() {
    const sortDir = convertSortDescriptorToPrisma(sortDirection);
    const orderBy = {};
    // @ts-ignore
    orderBy[sortColumn] = sortDir;

    return prisma.color.findMany({
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

  const items = await findColors();

  return {
    items,
    pages,
  };
}

export async function saveColor(color: ColorCreate, id: number | undefined) {
  return id ? updateColor(id, color) : createColor(color);
}

async function createColor(color: ColorCreate) {
  if (!colorSchema.safeParse(color)) {
    return {
      errMsg: "invalid data",
      value: null,
    };
  }

  return {
    errMsg: null,
    value: await prisma.color.create({ data: color }),
  };
}

async function updateColor(id: number, color: ColorCreate) {
  if (!colorSchema.safeParse(color)) {
    return {
      errMsg: "invalid data",
      value: null,
    };
  }

  return {
    errMsg: null,
    value: await prisma.color.update({
      where: { id },
      data: color,
    }),
  };
}
