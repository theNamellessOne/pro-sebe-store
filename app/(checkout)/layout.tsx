"use client";

import { ReactNode } from "react";
import { CartProvider } from "./cart/providers/cart-provider";
import { CategoryTreeProvider } from "@/app/(client)/providers/category-tree-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "../(client)/query-client";

export default function ({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <CartProvider>
        <CategoryTreeProvider>{children}</CategoryTreeProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}
