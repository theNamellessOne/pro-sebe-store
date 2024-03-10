"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { Check } from "lucide-react";
import { useColorFilter } from "@/app/(client)/catalogue/hooks/use-color-filter";
import { Button } from "@nextui-org/button";
import { debounce } from "@/util/debounce";

export function ColorFilter() {
  const { colors, toggleSelection, filterColors } = useColorFilter();

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
          Колір
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div
          className={"grid grid-cols-3 gap-4"}
          onClick={debounce(() => filterColors())}
        >
          {colors.map((item, idx) => {
            return (
              <button
                key={item.id}
                style={{ background: item.hexValue }}
                onClick={() => toggleSelection(idx)}
                className={
                  "flex flex-col items-center justify-center h-[40px] w-[40px] rounded-sm relative"
                }
              >
                {item.isSelected && (
                  <div
                    className={
                      "absolute inset-0 flex justify-center items-center text-white"
                    }
                  >
                    <Check />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
