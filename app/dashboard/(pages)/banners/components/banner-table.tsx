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
import { useBannerList } from "@/app/dashboard/(pages)/banners/hooks/use-banner-list";
import { useRouter } from "next/navigation";
import { useBannerTableCell } from "@/app/dashboard/(pages)/banners/hooks/use-banner-table-cell";
import { TableProps } from "@/app/dashboard/types/table-props";

export function BannerTable({ query, page, sortDescriptor }: TableProps) {
  const router = useRouter();
  const renderCell = useBannerTableCell();
  const { loading, list, sort, paginator } = useBannerList(
    query,
    page,
    sortDescriptor,
  );

  const columns = [
    { name: "Id", uid: "id" },
    { name: "Картинка", uid: "imageUrl" },
    { name: "Назва", uid: "name" },
    { name: "Верхнiй", uid: "shouldBeOnTop" },
  ];

  return (
    <Table
      onRowAction={(key) => router.push(`banners/edit/${key}`)}
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
