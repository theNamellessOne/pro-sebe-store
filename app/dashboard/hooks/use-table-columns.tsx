import { useContext } from "react";
import { TableColumnsContext } from "@/app/dashboard/providers/table-columns-provider";

export function useTableColumns() {
  return useContext(TableColumnsContext);
}
