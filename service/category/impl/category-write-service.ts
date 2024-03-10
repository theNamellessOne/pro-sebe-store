"use server";

import {
  CategorySave,
  categorySchema,
} from "@/schema/category/category-schema";
import prisma from "@/lib/prisma";

export async function _saveCategory(category: CategorySave) {
  return category.id ? _updateCategory(category) : _createCategory(category);
}

async function _createCategory(category: CategorySave) {
  if (!categorySchema.safeParse(category)) {
    return {
      errMsg: "invalid data",
      value: null,
    };
  }

  const path = await _reconstructPath(category.parentId);

  return {
    errMsg: null,
    value: await prisma.category.create({
      data: {
        ...category,
        path: path.join(";"),
      },
    }),
  };
}

async function _updateCategory(category: CategorySave) {
  if (!categorySchema.safeParse(category)) {
    return {
      errMsg: "invalid data",
      value: null,
    };
  }

  const id = category.id;
  const path = await _reconstructPath(category.parentId);

  return {
    errMsg: null,
    value: await prisma.category.update({
      where: { id },
      data: {
        ...category,
        path: path.join(";"),
        id: undefined,
      },
    }),
  };
}

async function _reconstructPath(parentId: number | null | undefined) {
  let path: string[] = [];

  if (!parentId) return path;

  const category = await prisma.category.findUnique({
    where: { id: parentId },
  });

  if (parentId === 0 || !category) return path;

  path.push(category.id.toString());
  path = path.concat(await _reconstructPath(category.parentId));

  return path;
}
