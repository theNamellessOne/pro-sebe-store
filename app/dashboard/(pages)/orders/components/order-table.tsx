"use client";

import { TableProps } from "@/app/dashboard/types/table-props";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { DashboardSearch } from "@/app/dashboard/components/dashboard-search";
import Loading from "@/app/loading";
import { useOrderTableCell } from "../hooks/use-order-table-cell";
import { useOrderList } from "../hooks/use-order-list";
import { useTableColumns } from "@/app/dashboard/hooks/use-table-columns";

export function OrderTable({
  query,
  page,
  sortDescriptor,
  status,
}: TableProps & { status: string }) {
  const renderCell = useOrderTableCell();
  const { loading, list, sort, paginator } = useOrderList(
    query,
    page,
    sortDescriptor,
    status,
  );

  const { shownColumns } = useTableColumns()!;

  return (
    <>
      {shownColumns.length > 0 && (
        <div className={"my-2 flex flex-col gap-3 relative"}>
          <Table
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
        </div>
      )}
    </>
  );
}
