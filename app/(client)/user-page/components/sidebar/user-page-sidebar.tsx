"use client";

import {Role} from "@prisma/client";
import React from "react";
import {UserPageSidebarItem} from "@/app/(client)/user-page/components/sidebar/user-page-sidebar-item";

export function UserPageSidebar() {
    const items = [
        {
            name: "Мої дані",
            href: "/user-page/user-data",
            role: Role.USER,
        },
        {
            name: "Обрані товари",
            href: "/user-page/favorite",
            role: Role.USER,
        },
        {
            name: "Мої замовлення",
            href: "/user-page/user-orders",
            role: Role.USER,
        },
        {
            name: "Мої адеси",
            href: "/user-page/use-address",
            role: Role.USER,
        },
    ];

    return (
        <>
            <aside
                className={
                    "flex flex-col overflow-y-auto fixed py-5 mx-[7%] w-[190px]"
                }
            >
                {items.map((item, idx) => {
                    return (
                        <UserPageSidebarItem {...item}/>
                    );
                })}
            </aside>
        </>
    )
}