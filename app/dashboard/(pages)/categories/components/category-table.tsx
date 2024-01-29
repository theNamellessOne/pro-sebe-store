"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import Loading from "@/app/loading";
import { DashboardSearch } from "@/app/dashboard/components/dashboard-search";
import { useRouter } from "next/navigation";
import { useCategoryTableCell } from "@/app/dashboard/(pages)/categories/hooks/use-category-table-cell";
import { useCategoryList } from "@/app/dashboard/(pages)/categories/hooks/use-category-list";
import { Key, useState } from "react";
import { TableProps } from "@/app/dashboard/types/table-props";
import { Selection } from "@nextui-org/react";
import { TableActions } from "@/app/dashboard/components/table-actions";
import { CategoryService } from "@/service/category/category-service";

const service = CategoryService.instance;

export function CategoryTable({ query, page, sortDescriptor }: TableProps) {
  const router = useRouter();
  const renderCell = useCategoryTableCell();
  const { loading, setLoading, list, sort, paginator } = useCategoryList(
    query,
    page,
    sortDescriptor,
  );
  const [selected, setSelected] = useState<Selection>(new Set([]));

  const columns = [
    { name: "Id", uid: "id" },
    { name: "Назва", uid: "name" },
    { name: "Батьківська Категорія", uid: "parentId" },
    { name: "Картинка", uid: "imageUrl" },
  ];

  const tableActions = [
    {
      name: "delete tree",
      action: async () => {
        await deleteAction(service.deleteTree);
      },
    },
    {
      name: "delete",
      action: async () => {
        await deleteAction(service.delete);
      },
    },
  ];

  const deleteAction = async (func: (id: number) => Promise<void>) => {
    setLoading(true);

    if (selected === "all") {
      await service.deleteMany(query);
    } else {
      for (const item of Array.from(selected)) {
        await func(parseInt(item.toString()));
      }
    }

    setSelected(new Set([]));
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
      <TableActions
        hasSelected={
          (selected as Set<Key>).size > 0 || (selected as string) === "all"
        }
        hasPaginator={!!paginator}
        actions={tableActions}
      />
    </div>
  );
}
