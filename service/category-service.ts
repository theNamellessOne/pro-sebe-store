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

export async function fetchAllCategories() {
  return prisma.category.findMany();
}

export async function fetchCategoryTree() {
  const root = await prisma.category.findMany({
    where: {
      parentId: 0,
    },
  });

  for (let i = 0; i < root.length; i++) {
    //@ts-ignore
    root[i]["children"] = await findChildren(root[i].id);
  }

  return root;
}

export async function fetchPossibleParents(id: number | undefined) {
  if (!id) {
    return prisma.category.findMany();
  }

  return prisma.category.findMany();
}

async function findChildren(id: number) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { children: true },
  });

  const children: any[] = [];

  for (const child of category?.children ?? []) {
    //@ts-ignore
    child["children"] = await findChildren(child.id);
    children.push(child);
  }

  return children;
}

export async function deleteCategory(id: number) {
  const children = await findChildren(id);
  const category = await prisma.category.findUnique({ where: { id } });

  for (let i = 0; i < children.length; i++) {
    await updateCategory(children[i].id, {
      name: children[i].name,
      parentId: category?.parentId,
    });
  }

  return prisma.category.delete({ where: { id } });
}

export async function deleteCategoryTree(id: number) {
  const children = await findChildren(id);

  for (let i = 0; i < children.length; i++) {
    await deleteCategoryTree(children[i].id);
  }

  return prisma.category.delete({ where: { id } });
}

export async function clearCategories() {
  const root = await prisma.category.findMany({
    where: {
      parentId: 0,
    },
  });

  for (let i = 0; i < root.length; i++) {
    await deleteCategoryTree(root[i].id);
  }
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
