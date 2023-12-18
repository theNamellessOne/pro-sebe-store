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
  const [loading, list, paginator] = useCategoryList(
    query,
    page,
    sortDescriptor,
  );

  const columns = [
    { name: "Id", uid: "id" },
    { name: "Назва", uid: "name" },
    { name: "Батьківська Категорія", uid: "parentId" },
  ];

  return (
    <Table
      onRowAction={(key) => router.push(`categories/edit/${key}`)}
      sortDescriptor={sortDescriptor}
      onSortChange={list.sort}
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
  );
}
