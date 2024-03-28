"use client";

import { OrderInput } from "@/schema/order/order-schema";
import { NovaPostService } from "@/service/novapost/novapost-service";
import { debounce } from "@/util/debounce";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export function SettlementAutocomplete() {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<
    { Present: string; DeliveryCity: String }[]
  >([]);

  const {
    setValue,
    register,
    watch,
    unregister,
    formState: { isSubmitting },
  } = useFormContext<OrderInput>();
  const settlementRef = watch("deliveryInfo.settlementRef");

  useEffect(() => {
    register("deliveryInfo.settlementRef");

    return () => unregister("deliveryInfo.settlementRef");
  }, [register]);

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
      onKeyUp={debounce((e: any) => {
        e.continuePropagation();
        load(e.target.value);
      })}
      onKeyDown={(e: any) => e.continuePropagation()}
      isLoading={isLoading}
      items={items}
      label="Населений пункт"
      isDisabled={isSubmitting}
      listboxProps={{
        emptyContent: "Нічого не знайдено 😞",
      }}
      variant="underlined"
      selectedKey={settlementRef}
      isRequired={true}
      classNames={{
        popoverContent: "rounded-sm",
      }}
      onSelectionChange={(selection) => {
        if (!selection) return;

        setValue("deliveryInfo.settlementRef", selection.toString(), {
          shouldValidate: true,
        });

        const description = items.find(
          (item) => item.DeliveryCity === selection.toString(),
        )?.Present;

        setValue("deliveryInfo.settlementDescription", description!, {
          shouldValidate: true,
        });
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
