"use client";

import { useFormContext } from "react-hook-form";
import { SectionTitle } from "@/app/dashboard/(pages)/products/components/form/section-title";
import { ProductCreate } from "@/schema/product-schema";
import { Select, SelectItem } from "@nextui-org/react";

export function InternalInfo() {
  const form = useFormContext<ProductCreate>();
  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  const values = ["DRAFT", "ACTIVE", "ARCHIVE"];

  return (
    <div className={"flex flex-col gap-4 p-4 shadow-small rounded-large"}>
      <SectionTitle title={"Внутрiшня Iнформацiя"} />

      <Select
        label="Статус"
        defaultSelectedKeys={new Set([form.getValues().status])}
        disabled={isSubmitting}
        isInvalid={!!errors.status}
        errorMessage={errors.status?.message}
      >
        {values.map((value) => (
          <SelectItem key={value} value={value}>
            {value}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
