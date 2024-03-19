import { useEffect, useState } from "react";
import NProgress from "nprogress";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PriceFilter } from "@/app/(client)/catalogue/types/product-filter";
import { ProductService } from "@/service/product/product-service";
import { filterEventChannel } from "../components/filters/events/filter-event-channgel";
import { useQuery } from "@tanstack/react-query";

export function usePriceFilter() {
  const queryClient = useQuery({
    queryKey: ["price-extremes"],
    queryFn: () => ProductService.instance.fetchPriceExtremes(),
  });

  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [value, setValue] = useState<number[]>([0, 0]);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const setPrice = (priceFilter: PriceFilter) => {
    NProgress.start();
    const params = new URLSearchParams(searchParams);
    if (priceFilter) {
      setValue([priceFilter.min, priceFilter.max]);
      params.set("priceFilter", JSON.stringify(priceFilter));
    } else {
      params.delete("priceFilter");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const readFilter = () => {
    const priceFilterParam = searchParams.get("priceFilter");
    if (!priceFilterParam) {
      return null;
    }

    return JSON.parse(priceFilterParam) as PriceFilter;
  };

  const load = () => {
    const res = queryClient.data;
    if (!res) return;

    setMin(Number(res.min.toString()));
    setMax(Number(res.max.toString()));

    const priceFilter = readFilter();
    if (!priceFilter) {
      setValue([Number(res.min.toString()), Number(res.max.toString())]);
      return;
    }

    setValue([priceFilter.min, priceFilter.max]);
  };

  useEffect(load, [queryClient.isFetched]);

  useEffect(() => {
    load();

    const searchUnsub = filterEventChannel.on("onSearchChange", load);

    return searchUnsub();
  }, []);

  return {
    loading: queryClient.isLoading,
    min,
    max,
    value,
    setPrice,
  };
}
