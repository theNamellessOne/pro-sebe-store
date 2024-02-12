"use server";

import prisma from "@/lib/prisma";
import { Cart, CartItem, ProductStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { CartIncludes } from "../cart-service";

export async function _createCart() {
  return prisma.cart.create({
    data: { subtotal: 0 },
    include: CartIncludes,
  });
}

export async function _addToCart(
  cartId: string,
  variantId: number,
  quantity: number,
) {
  const cart = await prisma.cart.findUnique({ where: { id: cartId } });

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

  const addedCost = variant.product.price.mul(quantity);

  const value = await prisma.cart.update({
    where: { id: cartId },
    data: {
      cartItems: {
        create: {
          subtotal: addedCost,
          variantId,
          quantity,
        },
      },
      subtotal: cart.subtotal.add(addedCost),
    },
    include: CartIncludes,
  });

  return { errMsg: null, value };
}

export async function _changeCartItemQuantity(
  cartId: string,
  variantId: number,
  newQuantity: number,
) {
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

  return _chageQuantity(cart, cartItem, variant.product.price, newQuantity);
}

async function _chageQuantity(
  cart: Cart,
  cartItem: CartItem,
  unitCost: Decimal,
  newQuantity: number,
) {
  const newItemSubtotal = unitCost.mul(newQuantity);

  let newCartSubtotal = cart.subtotal.sub(cartItem.subtotal);
  newCartSubtotal = cart.subtotal.add(newItemSubtotal);

  const value = await prisma.cart.update({
    where: { id: cart.id },
    data: {
      cartItems: {
        update: {
          where: { id: cartItem.id },
          data: {
            quantity: newQuantity,
            subtotal: newItemSubtotal,
          },
        },
      },
      subtotal: newCartSubtotal,
    },
    include: CartIncludes,
  });

  return { errMsg: null, value };
}
