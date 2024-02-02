"use client";

import { CartItems } from "./cart-items";
import { CartOrder } from "./cart-order";

export function CartWithItems() {
  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="lg:w-3/5">
        <CartItems />
      </div>

      <div className="grow h-full">
        <CartOrder />
      </div>
    </div>
  );
}
