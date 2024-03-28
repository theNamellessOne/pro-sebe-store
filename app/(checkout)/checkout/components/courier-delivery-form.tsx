"use client";

import { OrderInput } from "@/schema/order/order-schema";
import { Input } from "@nextui-org/react";
import { useFormContext } from "react-hook-form";
import { SettlementAutocomplete } from "./settlement-autocomplete";
import { useEffect } from "react";

export function CourierDeliveryForm() {
  const { formState, register, setValue, watch } = useFormContext<OrderInput>();
  const deliveryType = watch("deliveryInfo.deliveryType");

  useEffect(() => {
    setValue("deliveryInfo.settlementRef", "");
    setValue("deliveryInfo.warehouseKey", undefined);
    setValue("deliveryInfo.addressParts", undefined);
  }, [deliveryType]);

  const { errors, isSubmitting } = formState;

  return (
    <>
      <SettlementAutocomplete />
      <Input
        {...register("deliveryInfo.addressParts.street")}
        variant={"underlined"}
        label={"Вулиця"}
        isDisabled={isSubmitting}
        isInvalid={!!errors.deliveryInfo?.addressParts?.street}
        errorMessage={errors.deliveryInfo?.addressParts?.street?.message}
        isRequired={true}
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          {...register("deliveryInfo.addressParts.houseNo")}
          variant={"underlined"}
          label={"Номер будинку/квартира"}
          isDisabled={isSubmitting}
          isInvalid={!!errors.deliveryInfo?.addressParts?.houseNo}
          errorMessage={errors.deliveryInfo?.addressParts?.houseNo?.message}
          isRequired={true}
        />

        <Input
          {...register("deliveryInfo.addressParts.postalIdx")}
          variant={"underlined"}
          label={"Поштовий Індекс"}
          isDisabled={isSubmitting}
          isInvalid={!!errors.deliveryInfo?.addressParts?.postalIdx}
          errorMessage={errors.deliveryInfo?.addressParts?.postalIdx?.message}
          isRequired={true}
          description={
            <p>
              Увага! Неправильно зазначений поштовий індекс зробить доставку
              неможливою —{" "}
              <a
                href="http://services.ukrposhta.com/postindex_new/"
                target="_blank"
                className="hover:underline"
              >
                Знайти поштовий індекс
              </a>
            </p>
          }
        />
      </div>
    </>
  );
}
