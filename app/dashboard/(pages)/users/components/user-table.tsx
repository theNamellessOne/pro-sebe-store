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
import { useUserTableCell } from "@/app/dashboard/(pages)/users/hooks/use-user-table-cell";
import { useUserList } from "@/app/dashboard/(pages)/users/hooks/use-user-list";
import { TableProps } from "@/app/dashboard/types/table-props";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useTableColumns } from "@/app/dashboard/hooks/use-table-columns";
import { userEventChannel } from "@/app/dashboard/(pages)/users/event/user-event-channel";

export function UserTable({ query, page, sortDescriptor }: TableProps) {
  const renderCell = useUserTableCell();
  const { loading, list, sort, paginator } = useUserList(
    query,
    page,
    sortDescriptor,
  );

  const { shownColumns } = useTableColumns()!;

  useEffect(() => {
    const onUserUpdateUnsub = userEventChannel.on("onUserUpdate", list.reload);

    return () => {
      onUserUpdateUnsub();
    };
  }, []);

  return (
    <>
      {shownColumns.length > 0 && (
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
      <Toaster />
    </>
  );
}
