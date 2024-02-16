"use server";

import prisma from "@/lib/prisma";
import { CartIncludes } from "../cart-service";
import { _createCart } from "./cart-write-service";
import { auth } from "@/auth/auth";

export async function _fetchAndCreate(cartId: string | undefined) {
  const session = await auth();
  const userId = session?.user.id;

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: CartIncludes,
  });

  if (cart) {
    return cart;
  }

  if (!cart && !userId) {
    return _createCart();
  }

  if (!cart && userId) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: CartIncludes,
    });

    if (!cart) return _createCart(userId);

    return cart;
  }

  return await _createCart();
}
