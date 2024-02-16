"use client";

import { useState } from "react";
import { TableProps } from "@/app/dashboard/types/table-props";
import { Selection } from "@nextui-org/react";
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

export function OrderTable({
  query,
  page,
  sortDescriptor,
  status,
}: TableProps & { status: string }) {
  const renderCell = useOrderTableCell();
  const { loading, setLoading, list, sort, paginator } = useOrderList(
    query,
    page,
    sortDescriptor,
    status,
  );
  const [selected, setSelected] = useState<Selection>(new Set([]));

  const columns = [
    { name: "ContactInfo", uid: "contactInfo" },
    { name: "DeliveryInfo", uid: "deliveryInfo" },
    { name: "PaymentType", uid: "paymentType" },
    { name: "Total", uid: "total" },
    { name: "Status", uid: "status" },
    { name: "Actions", uid: "actions" },
  ];

  return (
    <div className={"my-2 flex flex-col gap-3 relative"}>
      <Table
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
    </div>
  );
}