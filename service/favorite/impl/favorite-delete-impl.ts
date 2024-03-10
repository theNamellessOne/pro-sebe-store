"use server";

import { auth } from "@/auth/auth";
import prisma from "@/lib/prisma";

export async function _removeFromFavorites(productArticle: string) {
  const session = await auth();

  if (!session?.user.id) return { errMsg: "unauthorized" };

  try {
    return {
      errMsg: null,
      value: await prisma.favorites.deleteMany({
        where: {
          userId: session.user.id,
          productArticle,
        },
      }),
    };
  } catch (err: any) {
    console.log("------------------>", err);
    return { errMsg: "не вдалось видалити з обраного" };
  }
}
