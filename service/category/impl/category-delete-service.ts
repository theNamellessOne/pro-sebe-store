"use server";

import prisma from "@/lib/prisma";
import { _findChildren } from "@/service/category/impl/category-util-service";
import { _saveCategory } from "@/service/category/impl/category-write-service";

export async function _deleteCategory(id: number) {
  prisma.$transaction(async () => _deleteCategoryNonTransactional(id));
}

async function _deleteCategoryNonTransactional(id: number) {
  const children = await _findChildren(id);
  const category = await prisma.category.findUnique({ where: { id } });

  for (let i = 0; i < children.length; i++) {
    await _saveCategory(children[i]);
  }

  await prisma.productCategory.deleteMany({
    where: {
      categoryId: id,
    },
  });

  await prisma.category.delete({ where: { id } });
}

export async function _deleteCategoryTree(id: number) {
  await prisma.$transaction(
    async () => {
      await _deleteCategoryTreeNonTransactional(id);
    },
    {
      maxWait: 5000,
      timeout: 10000,
    },
  );
}

async function _deleteCategoryTreeNonTransactional(id: number) {
  const children = await _findChildren(id);

  for (let i = 0; i < children.length; i++) {
    await _deleteCategoryTree(children[i].id);
  }

  await prisma.productCategory.deleteMany({
    where: {
      categoryId: id,
    },
  });

  await prisma.category.delete({ where: { id } });
}

function _getWhere(query: string | undefined) {
  let search: { search: string } | undefined;
  if (query && query.length > 0) search = { search: `${query}*` };

  return { name: { ...search } };
}

export async function _deleteManyCategories(query: string) {
  const categoriesToDelete = await prisma.category.findMany({
    where: _getWhere(query),
  });

  await prisma.$transaction(
    async () => {
      for (let i = 0; i < categoriesToDelete.length; i++) {
        await _deleteCategoryNonTransactional(categoriesToDelete[i].id);
      }
    },
    {
      maxWait: 5000,
      timeout: 10000,
    },
  );
}
