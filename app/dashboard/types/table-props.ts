import { SortDescriptor } from "@nextui-org/react";

export type TableProps = {
  query: string;
  page: number;
  sortDescriptor: SortDescriptor;
};
