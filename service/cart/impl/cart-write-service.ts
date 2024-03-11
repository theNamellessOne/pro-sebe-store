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
    return { errMsg: "Кошик з таким ID не знайдено!", value: null };
  }

  const variant = await prisma.variant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });

  if (!variant) {
    return { errMsg: "Товару немає в наявності!", value: null };
  }

  if (variant.product.status !== ProductStatus.ACTIVE) {
    return { errMsg: "Товару немає в наявності!", value: null };
  }

  if (variant.quantity < quantity) {
    return { errMsg: "Запитана кількість товару перевищує запас!", value: null };
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
    return { errMsg: "Кошику з таким ID немає!", value: null };
  }

  const variant = await prisma.variant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });

  if (!variant) {
    return { errMsg: "Товару немає в наявності!", value: null };
  }

  if (variant.product.status !== ProductStatus.ACTIVE) {
    return { errMsg: "Товару немає в наявності!", value: null };
  }

  if (variant.quantity < newQuantity) {
    return { errMsg: "Запитана кількість товару перевищує запас!", value: null };
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
