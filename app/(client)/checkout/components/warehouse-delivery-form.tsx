"use client";

import { OrderInput } from "@/schema/order/order-schema";
import { SettlementAutocomplete } from "./settlement-autocomplete";
import { WarehouseAutocomplete } from "./warehouse-autocomplete";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

export function WarehouseDeliveryForm() {
  const { setValue, watch } = useFormContext<OrderInput>();
  const deliveryType = watch("deliveryInfo.deliveryType");

  useEffect(() => {
    setValue("deliveryInfo.settlementRef", "");
    setValue("deliveryInfo.warehouseKey", undefined);
    setValue("deliveryInfo.addressParts", undefined);
  }, [deliveryType]);

  return (
    <>
      <SettlementAutocomplete />
      <WarehouseAutocomplete />
    </>
  );
}
