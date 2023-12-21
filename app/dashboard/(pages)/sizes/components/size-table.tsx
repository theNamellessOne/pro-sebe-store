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
import { useSizeTableCell } from "@/app/dashboard/(pages)/sizes/hooks/use-size-table-cell";
import { useSizeList } from "@/app/dashboard/(pages)/sizes/hooks/use-size-list";

export function SizeTable({
  query,
  page,
  sortDescriptor,
}: {
  query: string;
  page: number;
  sortDescriptor: SortDescriptor;
}) {
  const router = useRouter();
  const renderCell = useSizeTableCell();
  const { loading, list, sort, paginator } = useSizeList(
    query,
    page,
    sortDescriptor,
  );

  const columns = [
    { name: "Id", uid: "id" },
    { name: "Назва", uid: "name" },
    { name: "Обхват Грудей (cm)", uid: "chestSize" },
    { name: "Обхват Талії (cm)", uid: "waistSize" },
    { name: "Обхват Бедер (cm)", uid: "thighSize" },
  ];

  return (
    <Table
      onRowAction={(key) => router.push(`sizes/edit/${key}`)}
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
