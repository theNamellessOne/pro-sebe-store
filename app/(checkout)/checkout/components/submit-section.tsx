"use client";

import { OrderInput } from "@/schema/order/order-schema";
import { MiscService } from "@/service/misc/misc-service";
import { NovaPostService } from "@/service/novapost/novapost-service";
import { OrderDeliveryType, OrderPaymentType } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useCart } from "../../cart/hooks/use-cart";
import { Button } from "@/app/(client)/components/ui/button";
import { OrderService } from "@/service/order/order-service";
import { Spinner } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";

export function SubmitSection() {
  const { cart } = useCart()!;

  const [freeDeliveryMinPrice, setFreeDeliverMinPrice] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState("0");

  const {
    handleSubmit,
    watch,
    formState: { isValid, isSubmitting, errors },
  } = useFormContext<OrderInput>();

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
    if (!cart) return;
    if (!settlementRef) return;

    const deliveryMethod =
      deliveryType === OrderDeliveryType.COURIER
        ? "WarehouseDoors"
        : "WarehouseWarehouse";

    NovaPostService.instance
      .approximateCost(cart.subtotal, settlementRef, deliveryMethod)
      .then((res) => {
        // todo: handle possible error
        if (!res.success) return;

        if (paymentType === OrderPaymentType.PREPAID) {
          const formatted = (Math.round(res.data[0].Cost * 100) / 100).toFixed(
            2,
          );
          setDeliveryCost(formatted);
        }

        if (paymentType === OrderPaymentType.POSTPAID) {
          const data = res.data[0];
          const formatted = (
            Math.round((data.Cost + data.CostRedelivery) * 100) / 100
          ).toFixed(2);
          setDeliveryCost(formatted);
        }
      });
  }, [settlementRef, paymentType]);

  const total = useMemo(() => {
    if (!cart) return 0;

    if (paymentType === OrderPaymentType.POSTPAID) return 150;

    return cart?.subtotal;
  }, [deliveryCost, cart, paymentType]);

  const onSubmit = async (data: OrderInput) => {
    const response = await OrderService.instance.placeOrder(cart.id, data);
    if (response?.errMsg) toast.error(response.errMsg);
  };

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
          <span>
            {cart ? (Math.round(cart.subtotal * 100) / 100).toFixed(2) : "0.00"}{" "}
            UAH
          </span>
        </p>

        <p className="lg:text-lg uppercase flex justify-between">
          <span>
            доставка
            {cart?.subtotal < freeDeliveryMinPrice && "*"}
          </span>
          <span>
            {cart?.subtotal >= freeDeliveryMinPrice
              ? "безкоштовно"
              : deliveryCost + " UAH"}
          </span>
        </p>

        <h2 className="lg:text-lg uppercase flex justify-between mt-8">
          <span>до сплати</span>
          <span>{Math.round((total * 100) / 100).toFixed(2)} UAH</span>
        </h2>
      </div>

      <Button
        type="primary"
        className="uppercase flex items-center justify-center gap-4"
        disabled={!isValid || isSubmitting}
        onClick={handleSubmit(onSubmit)}
      >
        {isSubmitting && <Spinner size={"sm"} color={"primary"} />}
        замовити
      </Button>

      {cart?.subtotal < freeDeliveryMinPrice && (
        <p className={"text-sm text-primary/75 mt-auto"}>
          *сума приблизна та може відрізнятись від реальної
        </p>
      )}
      <Toaster />
    </div>
  );
}
