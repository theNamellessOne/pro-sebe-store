import React from "react";
import { UserPageSidebar } from "@/app/(client)/user-page/components/sidebar/user-page-sidebar";
import { Header } from "@/app/(client)/components/header/header";
import UserPageHeader from "@/app/(client)/user-page/components/user-page-header";
import Footer from "@/app/(client)/components/footer/footer";
import {UserPageSidebarMobile} from "@/app/(client)/user-page/components/sidebar/user-page-sidebar-mobile";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
        <>
            <div>
                <UserPageHeader/>
            </div>
            <div className={"hidden fixed md:block mt-[10px] ml-[7%] w-[190px]"}>
                <UserPageSidebar/>
            </div>
            <UserPageSidebarMobile />
            <div className={"h-full md:ml-[300px] md:mx-[10px] md:mr-[100px]"}>{children}</div>
        </>
    )
}
