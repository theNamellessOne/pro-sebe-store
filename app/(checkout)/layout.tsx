"use client";

import { ReactNode } from "react";
import { CartProvider } from "./cart/providers/cart-provider";
import { CategoryTreeProvider } from "@/app/(client)/providers/category-tree-provider";

export default function ({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <CategoryTreeProvider>{children}</CategoryTreeProvider>
    </CartProvider>
  );
}
