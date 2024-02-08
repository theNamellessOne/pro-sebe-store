import { SettlementAutocomplete } from "./settlement-autocomplete";
import { WarehouseAutocomplete } from "./warehouse-autocomplete";

export function WarehouseDeliveryForm() {
  return (
    <>
      <SettlementAutocomplete />
      <WarehouseAutocomplete />
    </>
  );
}
