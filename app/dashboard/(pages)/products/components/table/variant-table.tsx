"use client";

import { SectionTitle } from "@/app/dashboard/(pages)/products/components/form/section-title";
import { useVariantTableCell } from "@/app/dashboard/(pages)/products/hooks/use-variant-table-cell";
import { TableActions } from "@/app/dashboard/components/table-actions";
import Loading from "@/app/loading";
import { ProductSave } from "@/schema/product/product-schema";
import { VariantSave } from "@/schema/product/variant-schema";
import { Selection, useDisclosure } from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { Key, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ChangeAllVariantsQuantityModal } from "../modals/change-all-variants-quantity-modal";

export function VariantTable() {
  const form = useFormContext<ProductSave>();
  const variants = form.watch("variants");

  const renderCell = useVariantTableCell();
  const columns = [
    { name: "Назва", uid: "name" },
    { name: "Продано", uid: "sold" },
    { name: "Зарезервовано", uid: "reserved" },
    { name: "К-сть", uid: "quantity" },
    { name: "Медiа", uid: "media" },
  ];

  const [selected, setSelected] = useState<Selection>(new Set([]));
  const modalProps = useDisclosure();
  const [modalFn, setModalFn] = useState<(value: number) => void>(() => () => {
    console.log("default");
  });
  const [modalLabel, setModalLabel] = useState<string>("");
  const [modalHeader, setModalHeader] = useState<string>("");

  const changeVariantsQuantity = (fn: (current: number) => number) => {
    const newVariants = variants.map((variant) => {
      if (selected === "all" || Array.from(selected).includes(variant.name)) {
        return { ...variant, quantity: fn(variant.quantity) };
      }

      return variant;
    });

    form.setValue("variants", newVariants, { shouldValidate: true });
  };

  const tableActions = [
    {
      name: "додати к-сть",
      action: async () => {
        setModalHeader("Додати до кількості");
        setModalLabel("Скільки додати");

        setModalFn(() => (value: number) => {
          changeVariantsQuantity((current) => current + value);
        });

        modalProps.onOpen();
      },
    },
    {
      name: "відняти к-сть",
      action: async () => {
        setModalHeader("Відняти від кількості");
        setModalLabel("Скільки відняти");

        setModalFn(() => (value: number) => {
          changeVariantsQuantity((current) => current - value);
        });

        modalProps.onOpen();
      },
    },
    {
      name: "задати к-сть",
      action: async () => {
        setModalHeader("Задати кількість");
        setModalLabel("Нова кількість");

        setModalFn(() => (value: number) => {
          changeVariantsQuantity(() => value);
        });

        modalProps.onOpen();
      },
    },
  ];

  return (
    <div className={"my-2 flex flex-col gap-3 relative"}>
      <Table
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
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
          emptyContent={"Немає рядків для відображення."}
          items={variants}
        >
          {(item: VariantSave) => (
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
          (selected as Set<Key>).size > 0 || (selected as string) === "all"
        }
        hasPaginator={false}
        actions={tableActions}
      />

      <ChangeAllVariantsQuantityModal
        {...modalProps}
        header={modalHeader}
        label={modalLabel}
        fn={modalFn}
      />
    </div>
  );
}
