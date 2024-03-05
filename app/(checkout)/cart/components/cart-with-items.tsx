"use client";

import { CartItems } from "./cart-items";
import { CartOrder } from "./cart-order";
import {Header} from "@/app/(client)/components/header/header";
import Footer from "@/app/(client)/components/footer/footer";

export function CartWithItems() {
  return (
      <>
          <Header/>

    <div className="flex relative flex-col lg:flex-row min-h-screen">
      <div className="lg:w-3/5">
        <CartItems />
      </div>

      <CartOrder />
    </div>
          <Footer/>
      </>
  );
}
