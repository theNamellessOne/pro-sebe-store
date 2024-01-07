import { Key, useCallback } from "react";
import { VariantSave } from "@/app/dashboard/(pages)/products/schema/variant-schema";
import { Input, divider } from "@nextui-org/react";
import { ProductSave } from "../schema/product-schema";
import { UseFormReturn } from "react-hook-form";

export function useVariantTableCell() {
  return useCallback(
    (
      variant: VariantSave,
      columnKey: Key,
      form: UseFormReturn<ProductSave>,
    ) => {
      const setVariants = (value: number) => {
        const variants = form.getValues("variants") ?? [];

        for (let i = 0; i < variants.length; i++) {
          if (variants[i].name === variant.name) variants[i].quantity = value;
        }

        return variants;
      };

      switch (columnKey) {
        case "name":
          return variant.name;
        case "reserved":
          return <p className={"text-gray-500"}>{variant.reserved ?? 0}</p>;
        case "quantity":
          return (
            <div>
              <Input
                onValueChange={(value) => {
                  form.setValue("variants", setVariants(parseInt(value)));
                  form.trigger();
                }}
                defaultValue={(variant.quantity ?? 0).toString()}
              />
            </div>
          );
      }
    },
    [],
  );
}
