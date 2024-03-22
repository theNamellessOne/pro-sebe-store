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
import { useSizeTableCell } from "@/app/dashboard/(pages)/sizes/hooks/use-size-table-cell";
import { useSizeList } from "@/app/dashboard/(pages)/sizes/hooks/use-size-list";
import { TableProps } from "@/app/dashboard/types/table-props";
import { useTableColumns } from "@/app/dashboard/hooks/use-table-columns";

export function SizeTable({ query, page, sortDescriptor }: TableProps) {
  const router = useRouter();
  const renderCell = useSizeTableCell();
  const { loading, list, sort, paginator } = useSizeList(
    query,
    page,
    sortDescriptor,
  );

  const { shownColumns } = useTableColumns()!;

  return (
    <>
      {shownColumns.length > 0 && (
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
