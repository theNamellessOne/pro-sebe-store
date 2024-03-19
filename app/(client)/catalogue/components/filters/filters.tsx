"use client";

import { PriceFilter } from "@/app/(client)/catalogue/components/filters/price-filter";
import { ColorFilter } from "@/app/(client)/catalogue/components/filters/color-filter";
import { SizeFilter } from "@/app/(client)/catalogue/components/filters/size-filter";
import { SortBy } from "@/app/(client)/catalogue/components/filters/sort-by";

export function Filters() {
  return (
    <div
      className={"mt-3 mb-2 container mx-auto flex gap-3 overflow-x-auto px-6"}
    >
      <PriceFilter />
      <ColorFilter />
      <SizeFilter />
      <SortBy />
    </div>
  );
}
