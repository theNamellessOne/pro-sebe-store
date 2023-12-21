"use client";

import { SectionTitle } from "@/app/dashboard/(pages)/products/components/form/section-title";
import { useEffect, useState } from "react";
import { productEventChannel } from "@/app/dashboard/(pages)/products/events/product-event-channel";
import { useFormContext } from "react-hook-form";
import { ProductCreate } from "@/schema/product-schema";

export function VariantInfo() {
  const form = useFormContext<ProductCreate>();
  const [variants, setVariants] = useState<any>([]);

  function handleOptionsChange(payload: any[][]) {
    const sizes = payload[1];
    const colors = payload[0];

    const combinations = [];

    for (const color of colors) {
      for (const size of sizes) {
        combinations.push({
          name: color.name + " / " + size.name,
          sizeId: size.id,
          colorId: color.id,
        });
      }
    }

    form.setValue("variants", combinations);
    setVariants(combinations);
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

  return (
    <div
      className={
        "overflow-hidden relative flex flex-col gap-4 p-4 shadow-small rounded-large"
      }
    >
      <SectionTitle title={"Таблиця Варiантiв"} />

      {variants.length === 0 && (
        <p className={"italic text-default-400"}>wow, such empty</p>
      )}

      {variants.map((item: any) => {
        return (
          <div key={item.colorId.toString() + item.sizeId.toString()}>
            {item.name}
          </div>
        );
      })}
    </div>
  );
}
