import { OrderInput } from "@/schema/order/order-schema";
import { NovaPostService } from "@/service/novapost/novapost-service";
import { debounce } from "@/util/debounce";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export function WarehouseAutocomplete() {
  const { register, unregister, watch, setValue } =
    useFormContext<OrderInput>();

  const settlementRef = watch("deliveryInfo.settlementRef");
  const warehouseKey = watch("deliveryInfo.warehouseKey");

  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  const load = (findBy = "") => {
    setItems([]);
    if (!settlementRef || settlementRef === "") return;

    setIsLoading(true);
    NovaPostService.instance
      .fetchWarehouseByCityRef(settlementRef, findBy)
      .then(setItems)
      .finally(() => setIsLoading(false));
  };

  useEffect(load, [settlementRef]);

  useEffect(() => {
    register("deliveryInfo.warehouseKey");
    return () => unregister("deliveryInfo.warehouseKey");
  }, [register]);

  return (
    <Autocomplete
      onKeyDown={(e: any) => e.continuePropagation()}
      isLoading={isLoading}
      defaultItems={items}
      label="Відділення"
      variant="underlined"
      selectedKey={warehouseKey}
      onInputChange={debounce((value: string) => load(value))}
      classNames={{
        popoverContent: "rounded-sm",
      }}
      onSelectionChange={(selection) => {
        if (selection)
          setValue("deliveryInfo.warehouseKey", selection.toString(), {
            shouldValidate: true,
          });
      }}
    >
      {(item: any) => (
        <AutocompleteItem
          className={"rounded-sm"}
          key={item.SiteKey}
          value={item.Description}
        >
          {item.Description}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
