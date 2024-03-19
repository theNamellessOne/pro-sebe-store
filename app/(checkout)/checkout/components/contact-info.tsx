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
      <h2 className={"font-semibold text-2xl flex items-center gap-4"}>
        <p
          className={
            "rounded-full border-foreground border-2 w-10 h-10 flex justify-center items-center -mt-1"
          }
        >
          2
        </p>
        Контактні дані
      </h2>

      <div className="flex flex-col gap-2 pl-3">
        <div className="flex gap-4">
          <Input
            {...form.register("contactInfo.name")}
            variant={"underlined"}
            label={"Iм'я"}
            defaultValue={form.getValues("contactInfo.name")}
            disabled={isSubmitting}
            isInvalid={!!errors.contactInfo?.name}
            errorMessage={errors.contactInfo?.name?.message}
          />

          <Input
            {...form.register("contactInfo.surname")}
            variant={"underlined"}
            label={"Прізвище"}
            defaultValue={form.getValues("contactInfo.surname")}
            disabled={isSubmitting}
            isInvalid={!!errors.contactInfo?.surname}
            errorMessage={errors.contactInfo?.surname?.message}
          />
        </div>

        <Input
          {...form.register("contactInfo.middlename")}
          variant={"underlined"}
          label={"отчество"}
          disabled={isSubmitting}
          defaultValue={form.getValues("contactInfo.middlename")}
          isInvalid={!!errors.contactInfo?.middlename}
          errorMessage={errors.contactInfo?.middlename?.message}
        />

        <Input
          {...form.register("contactInfo.email")}
          variant={"underlined"}
          label={"Електронна пошта"}
          type={"email"}
          disabled={isSubmitting}
          defaultValue={form.getValues("contactInfo.email")}
          isInvalid={!!errors.contactInfo?.email}
          errorMessage={errors.contactInfo?.email?.message}
        />

        <Input
          {...form.register("contactInfo.phone")}
          variant={"underlined"}
          label={"Номер телефону"}
          disabled={isSubmitting}
          defaultValue={form.getValues("contactInfo.phone")}
          isInvalid={!!errors.contactInfo?.phone}
          errorMessage={errors.contactInfo?.phone?.message}
        />
      </div>
    </div>
  );
}
