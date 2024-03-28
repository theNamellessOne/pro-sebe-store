"use client";

import { OrderInput } from "@/schema/order/order-schema";
import { Radio, RadioGroup } from "@nextui-org/react";
import { Misc, OrderPaymentType } from "@prisma/client";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useCart } from "../../cart/hooks/use-cart";
import { MiscService } from "@/service/misc/misc-service";

export function PaymentMethodSelect() {
  const {
    setValue,
    register,
    watch,
    formState: { isSubmitting },
  } = useFormContext<OrderInput>();

  const { cart } = useCart()!;
  const [misc, setMisc] = useState<Misc | null>(null);

  useEffect(() => {
    MiscService.instance.fetch().then(setMisc);
    register("paymentType");
  }, []);

  const value = watch("paymentType");

  const radioButtonClassNames =
    "flex gap-4 ml-0.5 max-w-full rounded-sm border-transparent border-1" +
    " transition-colors hover:border-primary " +
    " data-[selected=true]:border-primary";

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className={"font-semibold text-2xl flex items-center gap-4"}>
        <p
          className={
            "rounded-full border-foreground border-2 w-10 h-10 flex justify-center items-center -mt-1"
          }
        >
          3
        </p>
        Метод оплати
      </h2>

      <RadioGroup
        classNames={{
          base: "gap-5",
          wrapper: "gap-5",
          label: "text-primary text-md lg:text-lg font-semibold capitalize",
        }}
        isDisabled={isSubmitting}
        size={"lg"}
        value={value}
        onValueChange={(value) => {
          if (value === OrderPaymentType.POSTPAID) {
            setValue("paymentType", OrderPaymentType.POSTPAID);
            return;
          }

          setValue("paymentType", OrderPaymentType.PREPAID);
        }}
      >
        <Radio
          classNames={{ base: radioButtonClassNames }}
          description="Карткою онлайн"
          value={OrderPaymentType.PREPAID}
        >
          За ревізитами
        </Radio>

        {cart?.subtotal > misc?.prepayPrice! && (
          <Radio
            classNames={{ base: radioButtonClassNames }}
            description={`По передплаті ${misc?.prepayPrice} UAH`}
            value={OrderPaymentType.POSTPAID}
          >
            Післяплата
          </Radio>
        )}
      </RadioGroup>
    </div>
  );
}
