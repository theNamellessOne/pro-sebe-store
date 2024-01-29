"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { useProductSortDescriptor } from "@/app/(client)/catalogue/hooks/use-product-sort-descriptor";

export function SortBy() {
  const { options, selected, setSelected } = useProductSortDescriptor();

  return (
    <Select
      aria-label={"sort"}
      aria-labelledby={"sort"}
      className={"w-60"}
      variant={"bordered"}
      selectedKeys={selected}
      onSelectionChange={(selection) => {
        setSelected(Array.from(selection)[0].toString());
      }}
      classNames={{
        selectorIcon: "text-foreground",
        trigger:
          "h-[40px] fill-foreground min-h-0 py-0 text-white border border-foreground rounded",
        innerWrapper: "py-0!",
        value: "text-foreground",
        popoverContent: "rounded-sm",
      }}
      size={"sm"}
    >
      {options.map((option) => (
        <SelectItem
          className={"capitalize rounded-sm"}
          key={option.name}
          value={option.name}
        >
          {option.name}
        </SelectItem>
      ))}
    </Select>
  );
}
