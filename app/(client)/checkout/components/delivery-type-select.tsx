"use client";

import { OrderDeliveryType } from "@prisma/client";
import React, { useEffect } from "react";
import { RadioGroup, Radio } from "@nextui-org/react";
import { useFormContext } from "react-hook-form";
import { OrderInput } from "@/schema/order/order-schema";

export function DeliveryTypeSelect() {
  const { formState, setValue, register, watch } = useFormContext<OrderInput>();
  const value = watch("deliveryInfo.deliveryType");

  useEffect(() => {
    register("deliveryInfo.deliveryType");
  }, [register]);

  const { errors } = formState;
  const { isSubmitting } = formState;

  return (
    <RadioGroup
      isDisabled={isSubmitting}
      value={value}
      onValueChange={(val) => {
        if (val === OrderDeliveryType.WAREHOUSE) {
          setValue("deliveryInfo.deliveryType", OrderDeliveryType.WAREHOUSE, {
            shouldValidate: true,
          });
          return;
        }

        setValue("deliveryInfo.deliveryType", OrderDeliveryType.COURIER, {
          shouldValidate: true,
        });
      }}
      errorMessage={errors.deliveryInfo?.deliveryType?.message}
      orientation="horizontal"
    >
      <Radio value={OrderDeliveryType.COURIER}>Кур'єром</Radio>
      <Radio value={OrderDeliveryType.WAREHOUSE}>Самовивіз</Radio>
    </RadioGroup>
  );
}
