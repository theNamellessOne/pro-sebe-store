"use client";

import { OrderInput } from "@/schema/order/order-schema";
import { MiscService } from "@/service/misc/misc-service";
import { NovaPostService } from "@/service/novapost/novapost-service";
import { OrderDeliveryType, OrderPaymentType } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useCart } from "../../cart/hooks/use-cart";
import { Button } from "@/app/(client)/components/ui/button";
import { OrderService } from "@/service/order/order-service";
import { Spinner } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import { debounce } from "@/util/debounce";

function calculatePercentage(part: number, whole: number) {
  if (whole === 0) {
    return 0;
  }

  return (part / 100) * whole;
}

export function SubmitSection() {
  const { cart } = useCart()!;

  const [hasDiscount, setHasDiscout] = useState(false);
  const [secondOrderDiscount, setSecondOrderDiscount] = useState(0);
  const [freeDeliveryMinPrice, setFreeDeliverMinPrice] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState("0");

  const {
    handleSubmit,
    watch,
    formState: { isValid, isSubmitting },
  } = useFormContext<OrderInput>();

  const settlementRef = watch("deliveryInfo.settlementRef");
  const deliveryType = watch("deliveryInfo.deliveryType");
  const paymentType = watch("paymentType");
  const email = watch("contactInfo.email");

  useEffect(() => {
    const loadMisc = async () => {
      const data = await MiscService.instance.fetch();

      return {
        freeDeliveryMinPrice: data ? data?.freeDeliveryMinPrice : 99999999999,
        secondOrderDiscount: data ? data.secondOrderDiscount : 0,
      };
    };

    loadMisc().then((res) => {
      setSecondOrderDiscount(res.secondOrderDiscount);
      setFreeDeliverMinPrice(res.freeDeliveryMinPrice);
    });
  }, []);

  const checkDiscount = useCallback(
    debounce((email: string) => {
      OrderService.instance.hasDiscount(email).then(setHasDiscout);
    }, 1000),
    [],
  );

  useEffect(() => {
    checkDiscount(email);
  }, [email]);

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

    const discount = hasDiscount
      ? calculatePercentage(secondOrderDiscount, cart.subtotal)
      : 0;

    return cart?.subtotal - discount;
  }, [deliveryCost, cart, paymentType, hasDiscount]);

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

          {hasDiscount && (
              <p className="lg:text-lg uppercase flex justify-between">
                <span>знижка</span>
                <span>
              {" "}
                  {cart
                      ? Math.round(
                          (calculatePercentage(secondOrderDiscount, cart.subtotal) *
                              100) /
                          100,
                      ).toFixed(2)
                      : "0"}
                  {" UAH"}
            </span>
              </p>
          )}

          <h2 className="lg:text-lg uppercase flex justify-between mt-8">
            <span>до оплати</span>
            <span>{Math.round((total * 100) / 100).toFixed(2)} UAH</span>
          </h2>
        </div>

        <Button
            type="primary"
            className="uppercase flex items-center justify-center"
            disabled={!isValid || isSubmitting}
            onClick={handleSubmit(onSubmit)}
        >
          {isSubmitting && <Spinner size={"sm"} color={"primary"}/>}
          замовити
        </Button>
        <div className={"mt-auto"}>
          <p className={"text-sm text-primary/75 mb-1.5"}>
            *при оформленні замовлення ви даєте згоду на обробку персональних даних
          </p>
          {cart?.subtotal < freeDeliveryMinPrice && (
              <p className={"text-sm text-primary/75"}>
                **сума приблизна та може відрізнятись від реальної
              </p>
          )}
        </div>
        <Toaster/>
      </div>
  );
}
