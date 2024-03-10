"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { useSizeFilter } from "@/app/(client)/catalogue/hooks/use-size-filter";
import { debounce } from "@/util/debounce";
import { Button } from "@nextui-org/button";

export function SizeFilter() {
  const { sizes, toggleSelection, filterSizes } = useSizeFilter();

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
          Розмір
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div
          onClick={debounce(() => filterSizes())}
          className={"grid grid-cols-3 gap-4"}
        >
          {sizes.map((item, idx) => {
            return (
              <button
                key={item.id}
                onClick={() => toggleSelection(idx)}
                className={`hover:bg-secondary rounded-sm transition-colors capitalize p-2 ${
                  item.isSelected && "underline"
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
