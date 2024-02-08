"use client";

import { OrderInput } from "@/schema/order/order-schema";
import { Input } from "@nextui-org/react";
import { useFormContext } from "react-hook-form";
import { SettlementAutocomplete } from "./settlement-autocomplete";

export function CourierDeliveryForm() {
  const { formState, register } = useFormContext<OrderInput>();

  const { errors, isSubmitting, isValid } = formState;

  return (
    <>
      <SettlementAutocomplete />
      <Input
        {...register("deliveryInfo.addressParts.street")}
        variant={"underlined"}
        label={"Вулиця"}
        disabled={isSubmitting}
        isInvalid={!!errors.deliveryInfo?.addressParts?.street}
        errorMessage={errors.deliveryInfo?.addressParts?.street?.message}
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          {...register("deliveryInfo.addressParts.houseNo")}
          variant={"underlined"}
          label={"Номер будинку/квартира"}
          disabled={isSubmitting}
          isInvalid={!!errors.deliveryInfo?.addressParts?.houseNo}
          errorMessage={errors.deliveryInfo?.addressParts?.houseNo?.message}
        />

        <Input
          {...register("deliveryInfo.addressParts.postalIdx")}
          variant={"underlined"}
          label={"Поштовий Індекс"}
          disabled={isSubmitting}
          isInvalid={!!errors.deliveryInfo?.addressParts?.postalIdx}
          errorMessage={errors.deliveryInfo?.addressParts?.postalIdx?.message}
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
