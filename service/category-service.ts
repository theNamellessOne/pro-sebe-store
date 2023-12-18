"use server";

import prisma from "@/lib/prisma";
import { convertSortDescriptorToPrisma } from "@/util/sort-descriptor-converter";

import { FetchFunctionProps } from "@/hooks/use-list";
import { CategoryCreate, categorySchema } from "@/schema/category-schema";

const COLOR_PAGE_SIZE = 10;

export async function fetchCategoryById(id: number) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { parent: true },
  });

  return {
    errMsg: category ? null : "Could not find category with specified Id",
    value: category,
  };
}

export async function fetchCategoryTree() {
  return prisma.category.findMany({
    where: {
      parentId: 0,
    },
    //да, это пиздец
    include: {
      parent: true,
      children: {
        include: {
          children: {
            include: {
              children: {
                include: {
                  children: {
                    include: {
                      children: {
                        include: {
                          children: {
                            include: {
                              children: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function fetchPossibleParents(id: number | undefined) {
  if (!id) {
    return prisma.category.findMany();
  }

  return prisma.category.findMany();
}

export async function fetchCategories({
  query,
  page,
  sortColumn,
  sortDirection,
}: FetchFunctionProps) {
  async function countPages() {
    const count = await prisma.category.count({
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

  async function findCategories() {
    const sortDir = convertSortDescriptorToPrisma(sortDirection);
    const orderBy = {};
    // @ts-ignore
    orderBy[sortColumn] = sortDir;

    return prisma.category.findMany({
      orderBy,
      take: COLOR_PAGE_SIZE,
      skip: (page - 1) * COLOR_PAGE_SIZE,
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

  const items = await findCategories();

  return {
    items,
    pages,
  };
}

export async function saveCategory(
  category: CategoryCreate,
  id: number | undefined,
) {
  return id ? updateCategory(id, category) : createCategory(category);
}

async function createCategory(category: CategoryCreate) {
  if (!categorySchema.safeParse(category)) {
    return {
      errMsg: "invalid data",
      value: null,
    };
  }

  return {
    errMsg: null,
    value: await prisma.category.create({ data: category }),
  };
}

async function updateCategory(id: number, category: CategoryCreate) {
  if (!categorySchema.safeParse(category)) {
    return {
      errMsg: "invalid data",
      value: null,
    };
  }

  return {
    errMsg: null,
    value: await prisma.category.update({
      where: { id },
      data: category,
    }),
  };
}
