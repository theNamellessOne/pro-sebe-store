"use client";

import { ReactNode } from "react";
import { CartProvider } from "./cart/providers/cart-provider";

export default function ({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
