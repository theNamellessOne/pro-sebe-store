"use server";

import prisma from "@/lib/prisma";
import { _rehydrateCart } from "./cart-write-service";

export async function _removeFromCart(cartId: string, variantId: string) {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      cartItems: {
        include: { variant: { include: { product: true } } },
      },
    },
  });

  if (!cart) {
    return { errMsg: "cart with specified id does not exist", value: null };
  }

  const cartItems = cart.cartItems.filter(
    (item) => item.variantId !== variantId,
  );

  return await _rehydrateCart(
    cartId,
    cartItems.map((item) => {
      return {
        variantId: item.variantId,
        unitPrice: item.variant.product.price,
        quantity: item.quantity,
      };
    }),
  );
}

export async function _clearCart(cartId: string) {
  return prisma.cartItem.deleteMany({ where: { cartId } });
}
