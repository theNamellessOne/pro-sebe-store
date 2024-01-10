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
import Loading from "@/app/dashboard/loading";
import { useProductTableCell } from "@/app/dashboard/(pages)/products/hooks/use-product-table-cell";
import { useProductList } from "@/app/dashboard/(pages)/products/hooks/use-product-list";
import { Product } from "@prisma/client";

export function ProductTable({ query, page, sortDescriptor }: TableProps) {
  const router = useRouter();
  const renderCell = useProductTableCell();
  const { loading, list, sort, paginator } = useProductList(
    query,
    page,
    sortDescriptor,
  );

  const columns = [
    { name: "Артикул", uid: "article" },
    { name: "Назва", uid: "name" },
    { name: "Статус", uid: "status" },
    { name: "Цiна", uid: "price" },
  ];

  return (
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
        {(item: Product) => (
          <TableRow key={item.article}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
