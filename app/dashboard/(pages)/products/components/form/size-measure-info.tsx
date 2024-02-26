"use client";

import { useEffect, useState } from "react";
import {
  Options,
  productEventChannel,
} from "@/app/dashboard/(pages)/products/events/product-event-channel";
import { useFormContext } from "react-hook-form";
import { ProductSave } from "@/schema/product/product-schema";
import { SizeMeasurementSave } from "@/schema/product/size-measurement-schema";
import { SectionTitle } from "./section-title";
import { Input } from "@nextui-org/react";

export function SizeMeasureInfo() {
  const form = useFormContext<ProductSave>();
  const [sizeMeasures, setSizeMeasures] = useState<SizeMeasurementSave[]>(
    form.getValues("sizeMeasures") ?? [],
  );

  const { errors, isSubmitting, isValid } = form.formState;

  function handleOptionsChange(payload: Options) {
    const newMeasures: SizeMeasurementSave[] = [];
    for (const size of payload.sizes) {
      //@ts-ignore
      newMeasures.push({ sizeName: size.name });
    }

    for (let i = 0; i < newMeasures.length; i++) {
      const newMeasure = newMeasures[i];
      for (const sizeMeasure of sizeMeasures) {
        if (newMeasure.sizeName === sizeMeasure.sizeName) {
          newMeasures[i] = sizeMeasure;
        }
      }
    }

    form.setValue("sizeMeasures", newMeasures);
    form.trigger().then((_) => setSizeMeasures(newMeasures));
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

  const setMeasures = (
    sizeName: string,
    column: keyof SizeMeasurementSave,
    value: number,
  ) => {
    const measures = form.getValues("sizeMeasures") ?? [];

    for (let i = 0; i < measures.length; i++) {
      if (measures[i].sizeName === sizeName)
        //@ts-ignore
        measures[i][column] = value;
    }

    return measures;
  };

  return (
    <div className={"flex flex-col gap-4 p-4 shadow-small rounded-large"}>
      <SectionTitle title={"Розмірна Сітка"} />
      {sizeMeasures.length === 0 && (
        <p className={"italic text-primary/70"}>тут поки що пусто</p>
      )}

      {sizeMeasures.map((measure) => {
        return (
          <div className={"flex flex-col md:flex-row gap-4 md:items-center"}>
            <p>{measure.sizeName}</p>

            <Input
              label={"Обахват грудей (см)"}
              onValueChange={(value) => {
                form.setValue(
                  "sizeMeasures",
                  setMeasures(measure.sizeName, "chestSize", parseInt(value)),
                );
                form.trigger();
              }}
              isDisabled={isSubmitting}
              isInvalid={!!errors.article}
              defaultValue={measure.chestSize.toString()}
              errorMessage={errors.article?.message}
            />

            <Input
              label={"Обхват талії (см)"}
              onValueChange={(value) => {
                form.setValue(
                  "sizeMeasures",
                  setMeasures(measure.sizeName, "waistSize", parseInt(value)),
                );
                form.trigger();
              }}
              isDisabled={isSubmitting}
              isInvalid={!!errors.article}
              defaultValue={measure.waistSize.toString()}
              errorMessage={errors.article?.message}
            />

            <Input
              label={"Обхват бедер (см)"}
              onValueChange={(value) => {
                form.setValue(
                  "sizeMeasures",
                  setMeasures(measure.sizeName, "thighSize", parseInt(value)),
                );
                form.trigger();
              }}
              isDisabled={isSubmitting}
              isInvalid={!!errors.article}
              defaultValue={measure.thighSize.toString()}
              errorMessage={errors.article?.message}
            />
          </div>
        );
      })}
    </div>
  );
}
