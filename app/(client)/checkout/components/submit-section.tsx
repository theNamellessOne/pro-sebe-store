"use client";

import { OrderInput } from "@/schema/order/order-schema";
import { MiscService } from "@/service/misc/misc-service";
import { NovaPostService } from "@/service/novapost/novapost-service";
import { OrderDeliveryType, OrderPaymentType } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useCart } from "../../cart/hooks/use-cart";
import { Button } from "../../components/ui/button";
import { PaymentMethodSelect } from "./payment-method-select";

export function SubmitSection() {
  const { cart } = useCart()!;

  const [freeDeliveryMinPrice, setFreeDeliverMinPrice] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(0);

  const { watch } = useFormContext<OrderInput>();

  const settlementRef = watch("deliveryInfo.settlementRef");
  const deliveryType = watch("deliveryInfo.deliveryType");
  const paymentType = watch("paymentType");

  useEffect(() => {
    MiscService.instance.fetch().then((res) => {
      // todo: handle error case
      if (!res) {
        return;
      }

      setFreeDeliverMinPrice(res.freeDeliveryMinPrice);
    });
  }, []);

  useEffect(() => {
    if (!settlementRef) return;

    const deliveryMethod =
      deliveryType === OrderDeliveryType.COURIER
        ? "WarehouseDoors"
        : "WarehouseWarehouse";

    NovaPostService.instance
      .approximateCost(cart.total, settlementRef, deliveryMethod)
      .then((res) => {
        // todo: handle possible error
        if (!res.success) return;

        if (paymentType === OrderPaymentType.PREPAID) {
          setDeliveryCost(res.data[0].Cost);
        }

        if (paymentType === OrderPaymentType.POSTPAID) {
          const data = res.data[0];
          setDeliveryCost(data.Cost + data.CostRedelivery);
        }
      });
  }, [settlementRef, paymentType]);

  const total = useMemo(() => {
    if (cart.total >= freeDeliveryMinPrice) return cart.total;

    return cart.total + deliveryCost;
  }, [deliveryCost, cart]);

  return (
    <div
      className={
        "bg-secondary h-full py-8 px-8 lg:pt-40 flex flex-col" +
        " w-full lg:w-2/5 gap-12 lg:fixed top-0 bottom-0 right-0"
      }
    >
      <div className="flex flex-col gap-2">
        <p className="lg:text-lg uppercase flex justify-between">
          <span>ціна товарів</span>
          <span>{cart.total} UAH</span>
        </p>

        <p className="lg:text-lg uppercase flex justify-between">
          <span>доставка</span>
          <span>
            {cart.total >= freeDeliveryMinPrice
              ? "безкоштовно"
              : deliveryCost + " UAH"}
          </span>
        </p>

        <h2 className="lg:text-lg uppercase flex justify-between mt-8">
          <span>до сплати</span>
          <span>{total} UAH</span>
        </h2>
      </div>

      <Button type="primary" className="uppercase">
        оформити замовлення
      </Button>
    </div>
  );
}
