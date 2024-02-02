"use client";

import { CartItems } from "./cart-items";
import { CartOrder } from "./cart-order";

export function CartWithItems() {
  return (
    <div className="flex flex-col lg:flex-row lg:h-screen">
      <CartItems />
      <CartOrder />
    </div>
  );
}
