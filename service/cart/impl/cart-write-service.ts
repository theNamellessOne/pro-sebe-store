"use server";

import prisma from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { CartIncludes } from "../cart-service";
import { _calculateCart } from "./cart-util-service";
import { _clearCart } from "./cart-delete-service";

export async function _createCart(userId?: string | undefined) {
  return prisma.cart.create({
    data: { subtotal: 0, userId: userId },
    include: CartIncludes,
  });
}

export async function _addToCart(
  cartId: string,
  variantId: string,
  quantity: number,
) {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      cartItems: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
  });

  if (!cart) {
    return { errMsg: "could not find cart with specified id", value: null };
  }

  const variant = await prisma.variant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });

  if (!variant) {
    return { errMsg: "no such product", value: null };
  }

  if (variant.product.status !== ProductStatus.ACTIVE) {
    return { errMsg: "no such product", value: null };
  }

  if (variant.quantity < quantity) {
    return { errMsg: "requested product quantity exceeds stock", value: null };
  }

  return await _rehydrateCart(cartId, [
    ...cart.cartItems.map((item) => {
      return {
        quantity: item.quantity,
        variantId: item.variantId,
        unitPrice: item.variant.product.price,
      };
    }),
    {
      variantId: variantId,
      unitPrice: variant.product.price,
      quantity: quantity,
    },
  ]);
}

export async function _changeCartItemQuantity(
  cartId: string,
  variantId: string,
  newQuantity: number,
) {
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

  const variant = await prisma.variant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });

  if (!variant) {
    return { errMsg: "no such product", value: null };
  }

  if (variant.product.status !== ProductStatus.ACTIVE) {
    return { errMsg: "no such product", value: null };
  }

  if (variant.quantity < newQuantity) {
    return { errMsg: "requested product quantity exceeds stock", value: null };
  }

  return await _rehydrateCart(
    cartId,
    cart.cartItems.map((item) => {
      return {
        variantId: item.variantId,
        unitPrice: item.variant.product.price,
        quantity: item.variantId === variantId ? newQuantity : item.quantity,
      };
    }),
  );
}

export async function _rehydrateCart(
  cartId: string,
  items: {
    quantity: number;
    unitPrice: Decimal;
    variantId: string;
  }[],
) {
  const info = _calculateCart(items);
  await _clearCart(cartId);

  return {
    errMsg: null,
    value: await prisma.cart.update({
      where: { id: cartId },
      data: {
        cartItems: {
          createMany: { data: info.cartItems },
        },
        subtotal: info.subtotal,
      },
      include: CartIncludes,
    }),
  };
}
