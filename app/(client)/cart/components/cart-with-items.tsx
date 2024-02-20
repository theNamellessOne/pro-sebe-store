"use client";

import { CartItems } from "./cart-items";
import { CartOrder } from "./cart-order";

export function CartWithItems() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="lg:w-3/5">
        <CartItems />
      </div>

      <CartOrder />
    </div>
  );
}
