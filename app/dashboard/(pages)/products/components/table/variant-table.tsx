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
import { VariantSave } from "@/app/dashboard/(pages)/products/schema/variant-schema";
import { SectionTitle } from "@/app/dashboard/(pages)/products/components/form/section-title";
import { Key, useState } from "react";
import { Selection, useDisclosure } from "@nextui-org/react";
import { AddQuantityModal } from "@/app/dashboard/(pages)/products/components/modals/add-quantity-modal";
import { useFormContext } from "react-hook-form";
import { ProductSave } from "../../schema/product-schema";
import { contentFieldToContent } from "uploadthing/client";

type VariantTableProps = {
  variants: VariantSave[];
};

export function VariantTable({ variants }: VariantTableProps) {
  const form = useFormContext<ProductSave>();

  const [selected, setSelected] = useState<"all" | Set<VariantSave>>(
    new Set([]),
  );
  const {
    isOpen: isAddQuantityOpen,
    onOpen: onAddQuantityOpen,
    onOpenChange: onAddQuantityChange,
  } = useDisclosure();

  const fromVariantsToKeys = () => {
    const variants = selected as Set<VariantSave>;
    const keys = Array.from(variants).map((variant) => variant.name);
    return new Set(keys);
  };

  const fromKeysToVariants = (selection: Selection) => {
    const keys = selection as Set<Key>;
    const variants = Array.from(keys).map((key) =>
      findVariantByName(key as string),
    );

    return new Set(variants);
  };

  const findVariantByName = (name: string) => {
    return variants.find((variant) => variant.name === name);
  };

  const renderCell = useVariantTableCell();
  const columns = [
    { name: "Назва", uid: "name" },
    { name: "Reserved", uid: "reserved" },
    { name: "Quantity", uid: "quantity" },
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
