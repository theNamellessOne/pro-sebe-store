"use client";

import { useFormContext } from "react-hook-form";
import { SectionTitle } from "@/app/dashboard/(pages)/products/components/form/section-title";
import { ProductCreate } from "@/schema/product-schema";
import { useEffect, useState } from "react";
import Loading from "@/app/dashboard/loading";
import { Select, SelectItem } from "@nextui-org/react";
import { fetchAllSizes } from "@/service/size-service";
import { fetchAllColors } from "@/service/color-service";
import { Chip } from "@nextui-org/chip";
import { productEventChannel } from "@/app/dashboard/(pages)/products/events/product-event-channel";

export function OptionInfo() {
  const form = useFormContext<ProductCreate>();
  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;
  const [loading, setLoading] = useState(true);

  const [sizes, setSizes] = useState<any>([]);
  const [colors, setColors] = useState<any>([]);
  const [selectedSizes, setSelectedSizes] = useState<any>([]);
  const [selectedColors, setSelectedColors] = useState<any>([]);

  useEffect(() => {
    const fetch = async () => {
      setSizes(await fetchAllSizes());
      setColors(await fetchAllColors());

      return false;
    };

    fetch().then(setLoading);
  }, []);

  return (
    <div
      className={
        "overflow-hidden relative flex flex-col gap-4 p-4 shadow-small rounded-large"
      }
    >
      <SectionTitle title={"Доступнi Опції"} />
      {loading && <Loading />}

      <Select
        isMultiline
        label="Кольори"
        disabled={isSubmitting}
        selectionMode={"multiple"}
        onSelectionChange={(selection) => {
          const selectionArray = Array.from(selection);
          const selected = [];

          for (const color of colors) {
            for (let selectionKey of selectionArray) {
              if (color.id === parseInt(selectionKey.toString())) {
                selected.push(color);
              }
            }
          }

          setSelectedColors(selected);
          productEventChannel.emit("onOptionsChanged", [
            selected,
            selectedSizes,
          ]);
        }}
        renderValue={(items) => {
          return (
            <div className="flex flex-wrap gap-2">
              {items.map((item) => {
                return (
                  <Chip
                    className={"w-full text-transparent"}
                    style={{ background: item.textValue }}
                    key={item.key}
                  >
                    0
                  </Chip>
                );
              })}
            </div>
          );
        }}
      >
        {colors?.map((color: any) => (
          <SelectItem
            startContent={
              <div
                className={"w-4 h-4 rounded"}
                style={{ background: color.hexValue }}
              ></div>
            }
            key={color.id}
            textValue={color.hexValue}
          >
            {color.name}
          </SelectItem>
        ))}
      </Select>

      <Select
        label="Розмiри"
        disabled={isSubmitting}
        selectionMode={"multiple"}
        onSelectionChange={(selection) => {
          const selectionArray = Array.from(selection);
          const selected = [];

          for (const size of sizes) {
            for (let selectionKey of selectionArray) {
              if (size.id === parseInt(selectionKey.toString())) {
                selected.push(size);
              }
            }
          }

          setSelectedSizes(selected);
          productEventChannel.emit("onOptionsChanged", [
            selectedColors,
            selected,
          ]);
        }}
      >
        {sizes?.map((category: any) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
