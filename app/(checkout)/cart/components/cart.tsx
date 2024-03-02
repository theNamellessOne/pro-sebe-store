"use client";

import { useCart } from "../hooks/use-cart";
import { CartWithItems } from "./cart-with-items";
import { EmptyCart } from "./empty-cart";

export function Cart() {
  const { cart } = useCart()!;

  if (cart?.cartItems?.length === 0) return <EmptyCart />;
  if (cart?.cartItems?.length !== 0) return <CartWithItems />;
}
