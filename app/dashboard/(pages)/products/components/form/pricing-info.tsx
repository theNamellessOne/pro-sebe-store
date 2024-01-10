"use client";

import { Input } from "@nextui-org/input";
import { useFormContext } from "react-hook-form";
import { SectionTitle } from "@/app/dashboard/(pages)/products/components/form/section-title";
import { ProductSave } from "@/schema/product/product-schema";
import { Tooltip } from "@nextui-org/react";
import { HelpCircle } from "lucide-react";

export function PricingInfo() {
  const form = useFormContext<ProductSave>();
  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;

  return (
    <div className={"flex flex-col gap-4 p-4 shadow-small rounded-large"}>
      <SectionTitle title={"Цiнова Iнформацiя"} />

      <Input
        {...form.register("price", {
          valueAsNumber: true,
        })}
        type={"number"}
        step={0.01}
        label={"Цiна"}
        disabled={isSubmitting}
        isInvalid={!!errors.price}
        defaultValue={form.getValues().price?.toString()}
        errorMessage={errors.price?.message}
        startContent={
          <p className={"-mb-0.5 flex-shrink-0 text-default-400"}>$</p>
        }
      />

      <Input
        {...form.register("compareAtPrice", {
          valueAsNumber: true,
        })}
        type={"number"}
        step={0.01}
        label={"Цiна для порiвняннь"}
        isDisabled={isSubmitting}
        isInvalid={!!errors.compareAtPrice}
        defaultValue={form.getValues().compareAtPrice?.toString()}
        errorMessage={errors.compareAtPrice?.message}
        startContent={
          <p className={"-mb-0.5 flex-shrink-0 text-default-400"}>$</p>
        }
        endContent={
          <Tooltip content={"suka"}>
            <HelpCircle className={"text-default-400"} />
          </Tooltip>
        }
      />
    </div>
  );
}
