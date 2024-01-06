"use client";

import { Input, Textarea } from "@nextui-org/input";
import { useFormContext } from "react-hook-form";
import { SectionTitle } from "@/app/dashboard/(pages)/products/components/form/section-title";
import { ProductSave } from "@/app/dashboard/(pages)/products/schema/product-schema";

export function GeneralInfo() {
  const form = useFormContext<ProductSave>();
  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  return (
    <div className={"flex flex-col gap-4 p-4 shadow-small rounded-large"}>
      <SectionTitle title={"Загальна Iнформацiя"} />

      <Input
        {...form.register("name")}
        label={"Назва"}
        isDisabled={isSubmitting}
        isInvalid={!!errors.name}
        defaultValue={form.getValues().name}
        errorMessage={errors.name?.message}
      />
      <Textarea
        {...form.register("description")}
        label={"Опис"}
        isDisabled={isSubmitting}
        isInvalid={!!errors.description}
        defaultValue={form.getValues().description}
        errorMessage={errors.description?.message}
      />
    </div>
  );
}