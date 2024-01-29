import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Size } from "@prisma/client";
import { SizeService } from "@/service/size/size-service";

export type SelectedSize = Size & { isSelected: boolean };

export function useSizeFilter() {
  const [sizes, setSizes] = useState<SelectedSize[]>([]);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const setFilter = (sizeIds: number[]) => {
    const params = new URLSearchParams(searchParams);
    if (sizeIds) {
      params.set("sizeFilter", JSON.stringify(sizeIds));
    } else {
      params.delete("sizeFilter");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const readFilter = () => {
    const sizeFilterParam = searchParams.get("sizeFilter");
    if (!sizeFilterParam) {
      return "all";
    }

    return JSON.parse(sizeFilterParam) as number[];
  };

  useEffect(() => {
    SizeService.instance.fetchAll().then((res) => {
      const selectedIds = readFilter();
      if (selectedIds === "all") {
        setSizes(
          res.map((item) => {
            return { isSelected: true, ...item };
          }),
        );
        return;
      }

      setSizes(
        res.map((item) => {
          return {
            isSelected: selectedIds.includes(item.id),
            ...item,
          };
        }),
      );
    });
  }, []);

  const toggleSelection = (idx: number) => {
    sizes[idx].isSelected = !sizes[idx].isSelected;
    setSizes([...sizes]);
  };

  const filterSizes = () => {
    const filteredSizes = sizes
      .filter((item) => item.isSelected)
      .map((item) => item.id);
    setFilter(filteredSizes);
  };

  return { sizes, toggleSelection, filterSizes };
}
