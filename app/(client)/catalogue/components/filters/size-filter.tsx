"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
} from "@nextui-org/react";
import { useSizeFilter } from "@/app/(client)/catalogue/hooks/use-size-filter";
import { debounce } from "@/util/debounce";
import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";

export function SizeFilter() {
  const { loading, sizes, toggleSelection, filterSizes } = useSizeFilter();

  if (loading) {
    return <Skeleton className={"w-[84px] h-[40px]"}></Skeleton>;
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
          Розмір
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div
          onClick={debounce(() => filterSizes())}
          className={"grid grid-cols-3 gap-4"}
        >
          {loading &&
            [1, 2, 3].map((i) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={
                  "min-w-[373px] shrink-0 flex flex-col gap-2 h-[500px]"
                }
                key={"size_loader_" + i}
              >
                <Skeleton className="rounded-sm mb-4 h-[40px] w-[40px]"></Skeleton>
              </motion.div>
            ))}

          {!loading &&
            sizes.map((item, idx) => {
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
