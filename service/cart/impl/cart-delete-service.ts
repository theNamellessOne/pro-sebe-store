"use server";

import prisma from "@/lib/prisma";

export async function _removeFromCart(cartId: string, variantId: number) {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { cartItems: true },
  });

  if (!cart) {
    return { errMsg: "cart with specified id does not exist", value: null };
  }

  const cartItem = cart.cartItems.find((item) => item.variantId === variantId);

  if (!cartItem) {
    return { errMsg: "product is not in cart", value: null };
  }

  const value = await prisma.cart.update({
    where: { id: cartId },
    data: {
      cartItems: {
        delete: { id: cartItem.id },
      },
      subtotal: cart.subtotal.sub(cartItem.subtotal),
    },
  });

  return { errMsg: null, value };
}
