"use client";

import { ReactNode } from "react";
import Footer from "./components/footer/footer";
import { Header } from "./components/header/header";
import { CategoryTreeProvider } from "@/app/(client)/providers/category-tree-provider";
import {CartProvider} from "@/app/(checkout)/cart/providers/cart-provider";

export default function ({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <CategoryTreeProvider>
        <div className={"flex flex-col min-h-screen"}>
          <Header />
          <div className={"grow"}>{children}</div>
          <Footer />
        </div>
      </CategoryTreeProvider>
    </CartProvider>
  );
}
