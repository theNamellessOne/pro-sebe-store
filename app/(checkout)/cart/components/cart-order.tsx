import Link from "next/link";

import { useCart } from "../hooks/use-cart";
import {Button} from "@/app/(client)/components/ui/button";

export function CartOrder() {
  const { cart } = useCart()!;

  return (
    <div
      className={
        "bg-secondary grow py-8 px-8 lg:pt-40 flex flex-col gap-12 " +
        "lg:sticky lg:right-0 lg:w-2/5"
      }
    >
      <h2 className="lg:text-lg uppercase flex justify-between">
        <span>загальна сума</span>
        <span>{cart?.subtotal} UAH</span>
      </h2>

      <Link href="/checkout" className="text-center">
        <Button type="primary" className="uppercase w-full">
          до оформлення
        </Button>
      </Link>
    </div>
  );
}
