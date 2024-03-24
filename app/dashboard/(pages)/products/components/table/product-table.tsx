"use client";

import { TableProps } from "@/app/dashboard/types/table-props";
import { useRouter } from "next/navigation";
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
import { useProductTableCell } from "@/app/dashboard/(pages)/products/hooks/use-product-table-cell";
import { useProductList } from "@/app/dashboard/(pages)/products/hooks/use-product-list";
import { Product } from "@prisma/client";
import { useTableColumns } from "@/app/dashboard/hooks/use-table-columns";

export function ProductTable({ query, page, sortDescriptor }: TableProps) {
  const router = useRouter();
  const renderCell = useProductTableCell();
  const { loading, list, sort, paginator } = useProductList(
    query,
    page,
    sortDescriptor,
  );

  const { shownColumns } = useTableColumns()!;

  return (
    <>
      {shownColumns.length > 0 && (
        <Table
          onRowAction={(key) => router.push(`products/edit/${key}`)}
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
            {(item: Product) => (
              <TableRow key={item.article}>
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
