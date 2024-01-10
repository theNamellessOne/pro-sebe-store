"use client";

import { useFormContext } from "react-hook-form";
import { SectionTitle } from "@/app/dashboard/(pages)/products/components/form/section-title";
import { PRODUCT_STATUSES, ProductSave } from "@/schema/product/product-schema";
import { Select, SelectItem } from "@nextui-org/react";
import { Input } from "@nextui-org/input";

export function InternalInfo({ isEditing = false }: { isEditing?: boolean }) {
  const form = useFormContext<ProductSave>();
  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  const registerArticleInput = () => {
    if (!isEditing) {
      return { ...form.register("article") };
    }
  };

  return (
    <div className={"flex flex-col gap-4 p-4 shadow-small rounded-large"}>
      <SectionTitle title={"Внутрiшня Iнформацiя"} />

      <Input
        {...registerArticleInput()}
        label={"Артикул"}
        isDisabled={isSubmitting || isEditing}
        isInvalid={!!errors.article}
        defaultValue={form.getValues().article}
        errorMessage={errors.article?.message}
      />

      <Select
        label="Статус"
        defaultSelectedKeys={new Set([form.getValues().status])}
        isDisabled={isSubmitting}
        isInvalid={!!errors.status}
        errorMessage={errors.status?.message}
      >
        {PRODUCT_STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
