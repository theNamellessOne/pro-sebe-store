"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { usePriceFilter } from "@/app/(client)/catalogue/hooks/use-price-filter";
import { debounce } from "@/util/debounce";

export function PriceFilter() {
  const { min, max, value, setPrice } = usePriceFilter();

  return (
    <Popover
      placement="bottom"
      showArrow
      classNames={{
        content: "rounded p-4",
      }}
    >
      <PopoverTrigger>
        <Button
          variant={"bordered"}
          className={"border border-foreground rounded"}
        >
          Ціна
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <Slider
          onChange={debounce((v: number[]) => {
            v = v as number[];
            setPrice({
              min: v[0],
              max: v[1],
            });
          }, 300)}
          label="Ціна"
          size={"sm"}
          step={1}
          minValue={min}
          maxValue={max}
          defaultValue={value}
          formatOptions={{ style: "currency", currency: "UAH" }}
          className={"w-60"}
        />
      </PopoverContent>
    </Popover>
  );
}
