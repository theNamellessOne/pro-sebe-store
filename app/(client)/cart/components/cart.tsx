"use client";

import { useCart } from "../hooks/use-cart";
import { CartWithItems } from "./cart-with-items";
import { EmptyCart } from "./empty-cart";

export function Cart() {
  const { cart } = useCart()!;

  if (cart.items.length === 0) return <EmptyCart />;

  return <CartWithItems />;
}
