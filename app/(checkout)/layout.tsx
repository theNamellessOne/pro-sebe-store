"use client";

import { ReactNode } from "react";
import { CartProvider } from "./cart/providers/cart-provider";
import { CategoryTreeProvider } from "@/app/(client)/providers/category-tree-provider";
import {Button} from "@nextui-org/button";
import {useRouter} from "next/navigation";
import {IoArrowBack} from "react-icons/io5";

export default function ({ children }: { children: ReactNode }) {
    const router = useRouter();

  return (
    <CartProvider>
      <CategoryTreeProvider>
              {children}
      </CategoryTreeProvider>
    </CartProvider>
  );
}
