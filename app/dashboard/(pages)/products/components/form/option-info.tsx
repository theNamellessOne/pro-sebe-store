"use client";

import { useFormContext } from "react-hook-form";
import { SectionTitle } from "@/app/dashboard/(pages)/products/components/form/section-title";
import { ProductSave } from "@/app/dashboard/(pages)/products/schema/product-schema";
import { useEffect, useState } from "react";
import Loading from "@/app/dashboard/loading";
import { Select, Selection, SelectItem } from "@nextui-org/react";
import { Chip } from "@nextui-org/chip";
import { productEventChannel } from "@/app/dashboard/(pages)/products/events/product-event-channel";
import { Color, Size } from "@prisma/client";
import { SizeService } from "@/app/dashboard/(pages)/sizes/service/size-service";
import { ColorService } from "@/app/dashboard/(pages)/colors/service/color-service";

export function OptionInfo() {
  const form = useFormContext<ProductSave>();
  const { errors } = form.formState;
  const { isSubmitting, isValid } = form.formState;
  const [loading, setLoading] = useState(true);

  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);
  const [selectedSizesKeys, setSelectedSizesKeys] = useState<Selection>(
    new Set([]),
  );
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);
  const [selectedColorsKeys, setSelectedColorsKeys] = useState<Selection>(
    new Set([]),
  );

  useEffect(() => {
    const fetch = async () => {
      return {
        sizes: await SizeService.instance.fetchAll(),
        colors: await ColorService.instance.fetchAll(),
      };
    };

    fetch().then((options) => {
      setSizes(options.sizes);
      setColors(options.colors);

      const sizesValue: Size[] = [];
      const colorsValue: Color[] = [];
      const variants = form.getValues("variants");

      if (!variants) {
        setLoading(false);
        return;
      }

      for (const variant of variants) {
        for (const size of options.sizes) {
          if (variant.sizeId === size.id) sizesValue.push(size);
        }
        for (const color of options.colors) {
          if (variant.colorId === color.id) colorsValue.push(color);
        }
      }

      setSelectedSizes(sizesValue);
      setSelectedColors(colorsValue);

      setSelectedSizesKeys(
        new Set(sizesValue.map((size) => size.id.toString())),
      );
      setSelectedColorsKeys(
        new Set(colorsValue.map((color) => color.id.toString())),
      );

      setLoading(false);
    });
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
        label="Кольори"
        isDisabled={isSubmitting}
        selectionMode={"multiple"}
        selectedKeys={selectedColorsKeys}
        onSelectionChange={(selection) => {
          setSelectedColorsKeys(selection);
          const selectionArray = Array.from(selection);
          const selected: Color[] = [];

          for (const color of colors) {
            for (const selectionKey of selectionArray) {
              if (color.id === parseInt(selectionKey.toString())) {
                selected.push(color);
              }
            }
          }

          setSelectedColors(selected);
          productEventChannel.emit("onOptionsChanged", {
            colors: selected,
            sizes: selectedSizes,
          });
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
        {colors?.map((color) => (
          <SelectItem
            startContent={
              <div
                className={"w-4 h-4 rounded"}
                style={{ background: color.hexValue }}
              />
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
        isDisabled={isSubmitting}
        selectionMode={"multiple"}
        selectedKeys={selectedSizesKeys}
        onSelectionChange={(selection) => {
          setSelectedSizesKeys(selection);
          const selectionArray = Array.from(selection);
          const selected: Size[] = [];

          for (const size of sizes) {
            for (const selectionKey of selectionArray) {
              if (size.id === parseInt(selectionKey.toString())) {
                selected.push(size);
              }
            }
          }

          setSelectedSizes(selected);
          productEventChannel.emit("onOptionsChanged", {
            colors: selectedColors,
            sizes: selected,
          });
        }}
      >
        {sizes?.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
