import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ColorService } from "@/service/colors/color-service";
import { Color } from "@prisma/client";
import { filterEventChannel } from "../components/filters/events/filter-event-channgel";

export type SelectedColor = Color & { isSelected: boolean };

export function useColorFilter() {
  const [colors, setColors] = useState<SelectedColor[]>([]);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const setFilter = (colorIds: number[]) => {
    const params = new URLSearchParams(searchParams);
    if (colorIds) {
      params.set("colorFilter", JSON.stringify(colorIds));
    } else {
      params.delete("colorFilter");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const readFilter = () => {
    const colorFilterParam = searchParams.get("colorFilter");
    if (!colorFilterParam) {
      return "all";
    }

    return JSON.parse(colorFilterParam) as number[];
  };

  const load = () => {
    console.log("suka");
    ColorService.instance.fetchAll().then((res) => {
      const selectedIds = readFilter();
      console.log(selectedIds);

      if (selectedIds === "all") {
        setColors([
          ...res.map((item) => {
            return { isSelected: false, ...item };
          }),
        ]);
        return;
      }

      setColors([
        ...res.map((item) => {
          return {
            isSelected: selectedIds.includes(item.id),
            ...item,
          };
        }),
      ]);
    });
  };

  useEffect(() => {
    load();

    const searchUnsub = filterEventChannel.on("onSearchChange", load);

    return () => {
      searchUnsub();
    };
  }, []);

  const toggleSelection = (idx: number) => {
    colors[idx].isSelected = !colors[idx].isSelected;
    setColors([...colors]);
  };

  const filterColors = () => {
    const filteredColors = colors
      .filter((item) => item.isSelected)
      .map((item) => item.id);
    setFilter(filteredColors);
  };

  return { colors, toggleSelection, filterColors };
}
