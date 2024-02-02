"use client";

import { MiscService } from "@/service/misc/misc-service";
import { Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { GoPackageDependents } from "react-icons/go";
import { useCart } from "../hooks/use-cart";
import { CartPosition } from "./cart-position";

export function CartItems() {
  const [freeDeliveryMinPrice, setFreeDeliverMinPrice] = useState(0);
  const { cart } = useCart()!;

  useEffect(() => {
    MiscService.instance.fetch().then((res) => {
      // todo: handle error case
      if (!res) {
        return;
      }

      setFreeDeliverMinPrice(res.freeDeliveryMinPrice);
    });
  }, []);

  return (
    <div>
      <div className={"flex gap-6 items-center uppercase"}>
        <h2 className={"font-semibold text-xl lg:text-2xl"}>Кошик</h2>
        <span className={"rounded-sm bg-secondary py-1 px-4"}>
          {cart.items.length} товар (-и)
        </span>
      </div>

      <div className={"text-xl flex gap-4 items-start"}>
        <GoPackageDependents className={"text-4xl mt-1 "} />
        <p>
          Безкоштовна доставка від <br /> {freeDeliveryMinPrice} грн
        </p>
      </div>

      <div className={"flex flex-col gap-4"}>
        {cart.items.map((item) => (
          <>
            <CartPosition key={item.id} item={item} />
            <Divider className={"my-[30px]"} />
          </>
        ))}
      </div>
    </div>
  );
}
