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
import { useTableColumns } from "@/app/dashboard/hooks/use-table-columns";

export function ColorTable({ query, page, sortDescriptor }: TableProps) {
  const router = useRouter();
  const renderCell = useColorTableCell();
  const { loading, list, sort, paginator } = useColorList(
    query,
    page,
    sortDescriptor,
  );

  const { shownColumns } = useTableColumns()!;

  return (
    <>
      {shownColumns.length > 0 && (
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
          <TableHeader columns={shownColumns}>
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
      )}
    </>
  );
}
