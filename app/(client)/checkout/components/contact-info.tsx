"use client";

import { OrderInput } from "@/schema/order/order-schema";
import { Input } from "@nextui-org/react";
import { useFormContext } from "react-hook-form";

export function ContactInfo() {
  const form = useFormContext<OrderInput>();

  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  return (
    <div className="flex flex-col gap-2 p-4">
      <h2 className={"font-semibold text-2xl"}>Контактні дані</h2>

      <Input
        {...form.register("contactInfo.name")}
        variant={"underlined"}
        label={"Iм'я"}
        disabled={isSubmitting}
        isInvalid={!!errors.contactInfo?.name}
        errorMessage={errors.contactInfo?.name?.message}
      />

      <Input
        {...form.register("contactInfo.surname")}
        variant={"underlined"}
        label={"Прізвище"}
        disabled={isSubmitting}
        isInvalid={!!errors.contactInfo?.surname}
        errorMessage={errors.contactInfo?.surname?.message}
      />

      <Input
        {...form.register("contactInfo.email")}
        variant={"underlined"}
        label={"Електронна пошта"}
        disabled={isSubmitting}
        isInvalid={!!errors.contactInfo?.email}
        errorMessage={errors.contactInfo?.email?.message}
      />

      <Input
        {...form.register("contactInfo.phone")}
        variant={"underlined"}
        label={"Номер телефону"}
        disabled={isSubmitting}
        isInvalid={!!errors.contactInfo?.phone}
        errorMessage={errors.contactInfo?.phone?.message}
      />
    </div>
  );
}
