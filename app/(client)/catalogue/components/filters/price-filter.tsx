"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Slider,
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { usePriceFilter } from "@/app/(client)/catalogue/hooks/use-price-filter";
import { debounce } from "@/util/debounce";
import { motion } from "framer-motion";

export function PriceFilter() {
  const { loading, min, max, value, setPrice } = usePriceFilter();

  if (loading) {
    return <Skeleton className={"w-[80px] h-[40px]"}></Skeleton>;
  }

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
        {loading &&
          [1, 2, 3].map((i) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={"min-w-[373px] shrink-0 flex flex-col gap-2 h-[500px]"}
              key={"price_loader_" + i}
            >
              <Skeleton className="rounded-sm mb-4 ">
                <p>text</p>
              </Skeleton>
            </motion.div>
          ))}

        {!loading && (
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
        )}
      </PopoverContent>
    </Popover>
  );
}
