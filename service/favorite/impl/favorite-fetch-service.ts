"use server";

import { auth } from "@/auth/auth";
import prisma from "@/lib/prisma";

export async function _getFavorites() {
  const session = await auth();

  if (!session?.user.id) return { errMsg: "unauthorized" };

  const data = await prisma.favorites.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return { value: data.map((item) => item.productArticle) };
}

export async function _getFullFavorites() {
  const session = await auth();

  if (!session?.user.id) return { errMsg: "unauthorized" };

  const value = await prisma.favorites.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      product: {
        include: { variants: true },
      },
    },
  });

  return {
    value,
  };
}
