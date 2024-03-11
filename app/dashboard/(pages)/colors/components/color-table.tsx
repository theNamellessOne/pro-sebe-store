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
import { useColorTableCell } from "@/app/dashboard/(pages)/colors/hooks/use-color-table-cell";
import { useColorList } from "@/app/dashboard/(pages)/colors/hooks/use-color-list";
import { useRouter } from "next/navigation";
import { TableProps } from "@/app/dashboard/types/table-props";

export function ColorTable({ query, page, sortDescriptor }: TableProps) {
  const router = useRouter();
  const renderCell = useColorTableCell();
  const { loading, list, sort, paginator } = useColorList(
    query,
    page,
    sortDescriptor,
  );

  const columns = [
    { name: "Id", uid: "id" },
    { name: "Назва", uid: "name" },
    { name: "Колір", uid: "hexValue" },
  ];

  return (
    <Table
      onRowAction={(key) => router.push(`colors/edit/${key}`)}
      sortDescriptor={sortDescriptor}
      onSortChange={sort}
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
        emptyContent={"Немає рядків для відображення."}
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
