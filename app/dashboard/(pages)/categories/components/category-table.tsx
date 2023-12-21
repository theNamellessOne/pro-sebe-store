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
import { DashboardSearch } from "@/app/dashboard/components/dashboard-search";
import { useRouter } from "next/navigation";
import { SortDescriptor } from "@nextui-org/react";
import { useCategoryTableCell } from "@/app/dashboard/(pages)/categories/hooks/use-category-table-cell";
import { useCategoryList } from "@/app/dashboard/(pages)/categories/hooks/use-category-list";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  clearCategories,
  deleteCategory,
  deleteCategoryTree,
} from "@/service/category-service";

export function CategoryTable({
  query,
  page,
  sortDescriptor,
}: {
  query: string;
  page: number;
  sortDescriptor: SortDescriptor;
}) {
  const router = useRouter();
  const renderCell = useCategoryTableCell();
  const { loading, setLoading, list, sort, paginator } = useCategoryList(
    query,
    page,
    sortDescriptor,
  );
  const [selected, setSelected] = useState(new Set([]));

  const columns = [
    { name: "Id", uid: "id" },
    { name: "Назва", uid: "name" },
    { name: "Батьківська Категорія", uid: "parentId" },
  ];

  const categoryTableActions = [
    {
      name: "delete tree",
      action: async () => {
        await deleteAction(deleteCategoryTree);
      },
    },
    {
      name: "delete",
      action: async () => {
        await deleteAction(deleteCategory);
      },
    },
  ];

  const deleteAction = async (func: (id: number) => Promise<any>) => {
    setLoading(true);
    setSelected(new Set([]));

    //@ts-ignore
    if (selected === "all") {
      await clearCategories();
    } else {
      //@ts-ignore
      for (const item of selected) {
        await func(parseInt(item));
      }
    }

    list.reload();
  };

  return (
    <div className={"my-2 flex flex-col gap-3 relative"}>
      <Table
        onRowAction={(key) => router.push(`categories/edit/${key}`)}
        sortDescriptor={sortDescriptor}
        onSortChange={sort}
        selectionMode="multiple"
        selectedKeys={selected}
        //@ts-ignore
        onSelectionChange={setSelected}
        topContent={<DashboardSearch />}
        bottomContent={paginator}
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
          isLoading={loading}
          items={list.items}
        >
          {(item: any) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <AnimatePresence>
        {
          //@ts-ignore
          (selected?.size > 0 || selected === "all") && (
            <motion.div
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex gap-3 bg-zinc-900 absolute ${
                paginator ? "bottom-14" : "bottom-2"
              } right-1/2 translate-x-1/2 w-fit shadow-small rounded-xl p-2`}
            >
              {categoryTableActions.map((item, idx) => {
                return (
                  <Button
                    key={item.name + idx}
                    variant={"flat"}
                    size={"sm"}
                    className={"text-sm"}
                    onClick={item.action}
                  >
                    {item.name}
                  </Button>
                );
              })}
            </motion.div>
          )
        }
      </AnimatePresence>
    </div>
  );
}
