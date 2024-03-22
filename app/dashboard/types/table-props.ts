import { SortDescriptor } from "@nextui-org/react";

export type TableProps = {
  query: string;
  page: number;
  sortDescriptor: SortDescriptor;
};

export type Column = {
  shown: boolean;
  name: string;
  uid: any;
};
