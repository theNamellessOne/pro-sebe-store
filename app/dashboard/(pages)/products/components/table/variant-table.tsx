"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import Loading from "@/app/dashboard/loading";
import { useVariantTableCell } from "@/app/dashboard/(pages)/products/hooks/use-variant-table-cell";
import { VariantSave } from "@/schema/product/variant-schema";
import { SectionTitle } from "@/app/dashboard/(pages)/products/components/form/section-title";
import { useFormContext } from "react-hook-form";
import { ProductSave } from "@/schema/product/product-schema";

type VariantTableProps = {
  variants: VariantSave[];
};

export function VariantTable({ variants }: VariantTableProps) {
  const form = useFormContext<ProductSave>();

  const renderCell = useVariantTableCell();
  const columns = [
    { name: "Назва", uid: "name" },
    { name: "Зарезервовано", uid: "reserved" },
    { name: "К-сть", uid: "quantity" },
    { name: "Медiа", uid: "media" },
  ];

  return (
    <div className={"my-2 flex flex-col gap-3 relative"}>
      <Table
        topContent={<SectionTitle title={"Таблиця Варiантiв"} />}
        classNames={{
          th: "bg-transparent text-primary",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn allowsSorting key={column.uid}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody
          loadingContent={<Loading />}
          emptyContent={"No rows to display."}
          items={variants}
        >
          {(item: VariantSave) => (
            <TableRow key={item.name}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey, form)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
