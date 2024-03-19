"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
} from "@nextui-org/react";
import { Check } from "lucide-react";
import { useColorFilter } from "@/app/(client)/catalogue/hooks/use-color-filter";
import { Button } from "@nextui-org/button";
import { debounce } from "@/util/debounce";
import { motion } from "framer-motion";

export function ColorFilter() {
  const { loading, colors, toggleSelection, filterColors } = useColorFilter();

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
          Колір
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div
          className={"grid grid-cols-3 gap-4"}
          onClick={debounce(() => filterColors())}
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
                key={"color_loader_" + i}
              >
                <Skeleton className="rounded-sm mb-4 h-[40px] w-[40px]"></Skeleton>
              </motion.div>
            ))}

          {!loading &&
            colors.map((item, idx) => {
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
