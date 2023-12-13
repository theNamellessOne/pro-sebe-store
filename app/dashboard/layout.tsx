import React from "react";
import { Sidebar } from "@/app/dashboard/components/sidebar/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <main className={"ml-[260px] mr-[10px] p-4"}>{children}</main>
    </>
  );
}
