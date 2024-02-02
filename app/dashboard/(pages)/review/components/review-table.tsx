"use client";

import {useRouter} from "next/navigation";
import {useReviewTableCell} from "@/app/dashboard/(pages)/review/hooks/use-review-table-cell";
import {useReviewList} from "@/app/dashboard/(pages)/review/hooks/use-review-list";
import {Key, useState} from "react";
import {TableProps} from "@/app/dashboard/types/table-props";
import {Selection} from "@nextui-org/react";
import {ReviewService} from "@/service/review/review-service";
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";
import {DashboardSearch} from "@/app/dashboard/components/dashboard-search";
import Loading from "@/app/dashboard/loading";
import {TableActions} from "@/app/dashboard/components/table-actions";

const service = ReviewService.instance;

export function ReviewTable({query, page, sortDescriptor}: TableProps) {
    const router = useRouter();
    const renderCell = useReviewTableCell();
    const {loading, setLoading, list, sort, paginator} = useReviewList(
        query,
        page,
        sortDescriptor,
    );
    const [selected, setSelected] = useState<Selection>(new Set([]));

    const columns = [
        {name: "Id", uid: "id"},
        {name: "User name", uid: "username"},
        {name: "Content", uid: "content"},
        {name: "Status", uid: "status"},
    ]

    const tableActions = [
        {
            name: "delete",
            action: async () => {
                await deleteAction(service.delete);
            },
        },
    ];

    const deleteAction = async (func: (id: number) => Promise<void>) => {
        setLoading(true);

        if (selected === "all") {
            await service.deleteMany(query);
        } else {
            for (const item of Array.from(selected)) {
                await func(parseInt(item.toString()));
            }
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
                topContent={<DashboardSearch/>}
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
                    loadingContent={<Loading/>}
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