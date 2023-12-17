import React from "react";
import { SidebarMobile } from "@/app/dashboard/components/sidebar/sidebar-mobile";
import { Sidebar } from "@/app/dashboard/components/sidebar/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={"hidden md:block"}>
        <Sidebar />
      </div>
      <SidebarMobile />
      <main className={"h-full md:ml-[250px] "}>{children}</main>
    </>
  );
}
