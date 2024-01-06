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
import { userVariantTableCell } from "@/app/dashboard/(pages)/products/hooks/use-variant-table-cell";
import { VariantSave } from "@/app/dashboard/(pages)/products/schema/variant-schema";
import { SectionTitle } from "@/app/dashboard/(pages)/products/components/form/section-title";
import { Key, useState } from "react";
import { Selection, useDisclosure } from "@nextui-org/react";
import { TableActions } from "@/app/dashboard/components/table-actions";
import { AddQuantityModal } from "@/app/dashboard/(pages)/products/components/modals/add-quantity-modal";

type VariantTableProps = {
  variants: VariantSave[];
};

export function VariantTable({ variants }: VariantTableProps) {
  const [selected, setSelected] = useState<"all" | Set<VariantSave>>(
    new Set([]),
  );
  const {
    isOpen: isAddQuantityOpen,
    onOpen: onAddQuantityOpen,
    onOpenChange: onAddQuantityChange,
  } = useDisclosure();

  const renderCell = userVariantTableCell();
  const columns = [
    { name: "Назва", uid: "name" },
    { name: "Reserved", uid: "reserved" },
    { name: "Quantity", uid: "quantity" },
  ];

  const tableActions = [
    {
      name: "Встановити к-сть",
      action: async () => {
        console.log("suka");
      },
    },
    {
      name: "Додати к-сть",
      action: onAddQuantityOpen,
    },
  ];

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

  return (
    <div className={"my-2 flex flex-col gap-3 relative"}>
      <AddQuantityModal
        isOpen={isAddQuantityOpen}
        onOpenChange={onAddQuantityChange}
      />
      <Table
        selectionMode="multiple"
        selectedKeys={
          typeof selected === "string" ? selected : fromVariantsToKeys()
        }
        onSelectionChange={(selection) => {
          if ((selection as string) === "all") setSelected("all");
          //@ts-ignore
          else setSelected(fromKeysToVariants(selection));
        }}
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
          {(item: any) => (
            <TableRow key={item.name}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TableActions
        hasSelected={
          (selected as Set<VariantSave>).size > 0 ||
          (selected as string) === "all"
        }
        hasPaginator={false}
        actions={tableActions}
      />
    </div>
  );
}
