import { PriceFilter } from "@/app/(client)/catalogue/components/filters/price-filter";
import { ColorFilter } from "@/app/(client)/catalogue/components/filters/color-filter";
import { SizeFilter } from "@/app/(client)/catalogue/components/filters/size-filter";
import { SortBy } from "@/app/(client)/catalogue/components/filters/sort-by";

export function Filters() {
  return (
    <div className={"flex gap-3 items-center justify-center flex-wrap"}>
      <PriceFilter />
      <ColorFilter />
      <SizeFilter />
      <SortBy />
    </div>
  );
}
