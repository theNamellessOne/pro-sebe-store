"use client";

import { Suspense } from "react";
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import { UserTable } from "@/app/dashboard/(pages)/users/components/user-table";
import { readSearchParams, SearchParams } from "@/util/read-search-params";
import { ExportEmailButton } from "./components/export-email-button";
import Loading from "@/app/loading";
import { TableColumnsProvider } from "@/app/dashboard/providers/table-columns-provider";
import { TableColumns } from "@/app/dashboard/components/table-columns";

export default async function Page({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const { query, currentPage, sortDescriptor } = readSearchParams(searchParams);

  return (
    <TableColumnsProvider
      storageName={"userColumns"}
      initialData={[
        { name: "Id", uid: "id", shown: true },
        { name: "Роль", uid: "role", shown: true },
        { name: "Iм'я", uid: "name", shown: true },
        { name: "Email", uid: "email", shown: true },
        { name: "@", uid: "username", shown: true },
        { name: "Номер Телефону", uid: "phone", shown: true },
        { name: "Дiї", uid: "actions", shown: true },
      ]}
    >
      <div
        className={"relative flex flex-col gap-4 h-full w-full p-4 px-[20px]"}
      >
        <DashboardHeader title={"Користувачi"} showCreateButton={false}>
          <div className={"w-full flex gap-2 items-center justify-end mr-2"}>
            <TableColumns />
            <ExportEmailButton href={"/api/users/export"} />
          </div>
        </DashboardHeader>

        <Suspense
          key={
            query +
            currentPage +
            sortDescriptor.direction +
            sortDescriptor.column
          }
          fallback={<Loading />}
        >
          <UserTable
            query={query}
            page={currentPage}
            sortDescriptor={sortDescriptor}
          />
        </Suspense>
      </div>
    </TableColumnsProvider>
  );
}
