import { usePathname, useRouter, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import { useEffect, useState } from "react";
import { Size } from "@prisma/client";
import { SizeService } from "@/service/size/size-service";
import { filterEventChannel } from "../components/filters/events/filter-event-channgel";
import { useQuery } from "@tanstack/react-query";

export type SelectedSize = Size & { isSelected: boolean };

export function useSizeFilter() {
  const queryClient = useQuery({
    queryKey: ["sizes"],
    queryFn: () => SizeService.instance.fetchAll(),
  });

  const [sizes, setSizes] = useState<SelectedSize[]>([]);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const setFilter = (sizeIds: number[]) => {
    NProgress.start();
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

  const load = () => {
    const res = queryClient.data;
    if (!res) return;

    const selectedIds = readFilter();
    if (selectedIds === "all") {
      setSizes([
        ...res.map((item) => {
          return { isSelected: false, ...item };
        }),
      ]);
      return;
    }

    setSizes([
      ...res.map((item) => {
        return {
          isSelected: selectedIds.includes(item.id),
          ...item,
        };
      }),
    ]);
  };

  useEffect(load, [queryClient.isFetched]);

  useEffect(() => {
    load();

    const searchUnsub = filterEventChannel.on("onSearchChange", load);

    return searchUnsub();
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

  return {
    loading: queryClient.isLoading,
    sizes,
    toggleSelection,
    filterSizes,
  };
}
