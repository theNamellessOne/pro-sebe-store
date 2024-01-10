"use client";

import { useEffect, useState } from "react";
import {
  Options,
  productEventChannel,
} from "@/app/dashboard/(pages)/products/events/product-event-channel";
import { useFormContext } from "react-hook-form";
import { ProductSave } from "@/schema/product/product-schema";
import { VariantSave } from "@/schema/product/variant-schema";
import { VariantTable } from "@/app/dashboard/(pages)/products/components/table/variant-table";

export function VariantInfo() {
  const form = useFormContext<ProductSave>();
  const [variants, setVariants] = useState<VariantSave[]>(
    form.getValues("variants") ?? [],
  );

  function handleOptionsChange(payload: Options) {
    const combinations: VariantSave[] = [];

    for (const color of payload.colors) {
      for (const size of payload.sizes) {
        combinations.push({
          name: `${color.name} / ${size.name}`,
          sizeId: size.id,
          colorId: color.id,
          quantity: 0,
          mediaUrls: [],
        });
      }
    }

    for (let i = 0; i < combinations.length; i++) {
      const combination = combinations[i];
      for (const variant of variants) {
        if (combination.name === variant.name) {
          combinations[i] = variant;
        }
      }
    }

    form.setValue("variants", combinations);
    form.trigger().then((_) => setVariants(combinations));
  }

  useEffect(() => {
    const onOptionsChangedUnsub = productEventChannel.on(
      "onOptionsChanged",
      handleOptionsChange,
    );

    return () => {
      onOptionsChangedUnsub();
    };
  }, []);

  return <VariantTable variants={variants} />;
}
