"use client";

import { MiscService } from "@/service/misc/misc-service";
import { Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { PiPackageThin } from "react-icons/pi";
import { useCart } from "../hooks/use-cart";
import { CartPosition } from "./cart-position";
import {Button} from "@nextui-org/button";
import {IoArrowBack} from "react-icons/io5";
import {useRouter} from "next/navigation";

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
    <div className={"p-8"}>
      <div className="flex flex-col gap-6">
        <div className={"flex gap-6 items-center uppercase"}>
          <Button isIconOnly color={"primary"} className={"rounded-sm"} variant={"light"}
                  onPress={useRouter().back}
          >
            <IoArrowBack className={"w-6 h-6"}/>
          </Button>
          <h2 className={"font-bold text-xl lg:text-2xl"}>Кошик</h2>
          <span className={"rounded-sm bg-secondary py-1 px-4"}>
            {cart?.cartItems.length} товар (-и)
          </span>
        </div>

        <div className={"text-xl flex gap-4 items-center"}>
          <PiPackageThin className={"text-4xl mt-1 mx-1.5"} />
          <p>Безкоштовна доставка від {freeDeliveryMinPrice} грн</p>
        </div>
      </div>

      <div className={"flex flex-col gap-4 mt-6 lg:mt-8 overflow-y-scroll"}>
        {cart?.cartItems.map((item: any, idx: number) => (
          <>
            <CartPosition key={item.id} item={item} />
            {idx !== cart?.cartItems.length - 1 && (
              <Divider className={"my-[30px]"} />
            )}
          </>
        ))}
      </div>
    </div>
  );
}
