"use server";

import prisma from "@/lib/prisma";
import { CartIncludes } from "../cart-service";
import { _createCart } from "./cart-write-service";

export async function _fetchById(cartId: string) {
  let cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: CartIncludes,
  });

  if (!cart) {
    cart = await _createCart();
  }

  return cart;
}
