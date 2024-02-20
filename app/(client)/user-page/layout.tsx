import React from "react";
import { UserPageSidebar } from "@/app/(client)/user-page/components/sidebar/user-page-sidebar";
import { Header } from "@/app/(client)/components/header/header";
import UserPageHeader from "@/app/(client)/user-page/components/user-page-header";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>
        <UserPageHeader />
      </div>
      <div>
        <UserPageSidebar />
      </div>
      <main className={"ml-[160px]"}>{children}</main>
    </>
  );
}
