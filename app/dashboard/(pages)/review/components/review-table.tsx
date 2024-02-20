"use client";

import { useReviewTableCell } from "@/app/dashboard/(pages)/review/hooks/use-review-table-cell";
import { useReviewList } from "@/app/dashboard/(pages)/review/hooks/use-review-list";
import { Key, useEffect, useState } from "react";
import { TableProps } from "@/app/dashboard/types/table-props";
import { Selection } from "@nextui-org/react";
import { ReviewService } from "@/service/review/review-service";
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
import { TableActions } from "@/app/dashboard/components/table-actions";
import { reviewEventChannel } from "@/app/dashboard/(pages)/review/event/review-event-channel";
import { ReviewStatus } from "@prisma/client";

const service = ReviewService.instance;

export function ReviewTable({ query, page, sortDescriptor }: TableProps) {
  const renderCell = useReviewTableCell();
  const { loading, setLoading, list, sort, paginator } = useReviewList(
    query,
    page,
    sortDescriptor,
  );
  const [selected, setSelected] = useState<Selection>(new Set([]));

  const columns = [
    { name: "Id", uid: "id" },
    { name: "Content", uid: "content" },
    { name: "Status", uid: "status" },
    { name: "Rating", uid: "rating" },
    { name: "Actions", uid: "actions" },
  ];

  useEffect(() => {
    const onReviewUpdateUnsub = reviewEventChannel.on(
      "onReviewUpdate",
      list.reload,
    );

    return () => {
      onReviewUpdateUnsub();
    };
  }, []);

  const tableActions = [
    {
      name: "видалити",
      action: async () => {
        await deleteAction();
      },
    },
    {
      name: "відобразити",
      action: async () => {
        await approveAction();
      },
    },
    {
      name: "сховати",
      action: async () => {
        await onModerationAction();
      },
    },
  ];

  const approveAction = async () => {
    if (selected === "all") {
      await service.setStatusMany(query, ReviewStatus.APPROVED);
    } else {
      await service.setStatusManyById(
        Array.from(selected).map((id) => parseInt(id.toString())),
        ReviewStatus.APPROVED,
      );
    }
    setSelected(new Set([]));
    list.reload();
  };

  const onModerationAction = async () => {
    if (selected === "all") {
      await service.setStatusMany(query, ReviewStatus.ON_MODERATION);
    } else {
      await service.setStatusManyById(
        Array.from(selected).map((id) => parseInt(id.toString())),
        ReviewStatus.ON_MODERATION,
      );
    }
    setSelected(new Set([]));
    list.reload();
  };

  const deleteAction = async () => {
    setLoading(true);

    if (selected === "all") {
      await service.deleteMany(query);
    } else {
      await service.deleteManyByIds(
        Array.from(selected).map((id) => parseInt(id.toString())),
      );
    }
    setSelected(new Set([]));
    list.reload();
  };

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
      <TableActions
        hasSelected={
          (selected as Set<Key>).size > 0 || (selected as string) === "all"
        }
        hasPaginator={!!paginator}
        actions={tableActions}
      />
    </div>
  );
}
