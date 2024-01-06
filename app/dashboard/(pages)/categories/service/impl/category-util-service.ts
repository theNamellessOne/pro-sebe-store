"use server";

import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";

export async function _findChildren(id: number) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      children: {
        include: {
          children: true,
        },
      },
    },
  });

  const children: Category[] = [];

  for (const child of category?.children ?? []) {
    child.children = await _findChildren(child.id);
    children.push(child);
  }

  return children;
}
