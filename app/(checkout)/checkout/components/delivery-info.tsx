"use client";

import { OrderInput } from "@/schema/order/order-schema";
import { Tab, Tabs } from "@nextui-org/react";
import { OrderDeliveryType } from "@prisma/client";
import { useFormContext } from "react-hook-form";
import { CourierDeliveryForm } from "./courier-delivery-form";
import { WarehouseDeliveryForm } from "./warehouse-delivery-form";

export function DeliveryInfo() {
  const {
    watch,
    setValue,
    formState: { isSubmitting },
  } = useFormContext<OrderInput>();
  const value = watch("deliveryInfo.deliveryType");

  return (
    <div className="flex flex-col gap-3 p-4">
      <h2 className={"font-semibold text-2xl flex items-center gap-4"}>
        <p
          className={
            "rounded-full border-foreground border-2 w-10 h-10 flex justify-center items-center -mt-1"
          }
        >
          1
        </p>
        Спосіб доставки
      </h2>

      <Tabs
        isDisabled={isSubmitting}
        size={"lg"}
        selectedKey={value}
        onSelectionChange={(selection) => {
          if (selection === OrderDeliveryType.WAREHOUSE) {
            setValue("deliveryInfo.deliveryType", OrderDeliveryType.WAREHOUSE);
            return;
          }

          setValue("deliveryInfo.deliveryType", OrderDeliveryType.COURIER);
        }}
        variant={"underlined"}
        aria-label="delivery options"
        classNames={{ panel: "pl-3 -mt-3" }}
      >
        <Tab key={OrderDeliveryType.COURIER} title={'Кур\'єром "Нова Пошта"'}>
          <CourierDeliveryForm />
        </Tab>
        <Tab key={OrderDeliveryType.WAREHOUSE} title={'Самовивіз "Нова Пошта"'}>
          <WarehouseDeliveryForm />
        </Tab>
      </Tabs>
    </div>
  );
}
