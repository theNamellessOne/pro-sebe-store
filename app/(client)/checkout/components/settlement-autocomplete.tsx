"use client";

import { OrderInput } from "@/schema/order/order-schema";
import { NovaPostService } from "@/service/novapost/novapost-service";
import { debounce } from "@/util/debounce";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

export function SettlementAutocomplete() {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  const { formState, setValue, register, watch } = useFormContext<OrderInput>();
  const settlementRef = watch("deliveryInfo.settlementRef");

  useEffect(() => {
    register("deliveryInfo.settlementRef");
  }, [register]);

  const selectedName = useMemo(() => {
    const filtered = items.filter((value: any) => value.Ref === settlementRef);
    if (filtered.length === 1) {
      return filtered[0].Present;
    }

    return "";
  }, [settlementRef]);

  const load = (v: string) => {
    setIsLoading(true);
    NovaPostService.instance
      .searchSettlement(v)
      .then((res) => {
        setItems(res.length > 0 ? res : items);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Autocomplete
      onKeyDown={(e: any) => e.continuePropagation()}
      isLoading={isLoading}
      items={items}
      label="Населений пункт"
      variant="underlined"
      onInputChange={debounce((value: string) => load(value))}
      selectedKey={settlementRef}
      classNames={{
        popoverContent: "rounded-sm",
      }}
      onSelectionChange={(selection) => {
        if (selection)
          setValue("deliveryInfo.settlementRef", selection.toString());
      }}
    >
      {(item: any) => (
        <AutocompleteItem className={"rounded-sm"} key={item.DeliveryCity}>
          {item.Present}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
