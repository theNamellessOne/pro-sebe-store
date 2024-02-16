"use client";

import React from "react";

type UserPageHeaderProps = {
    title: string;
};

export default function UserPageHeader() {
    return (
        <header className={"flex justify-between items-center mx-[7%] border-b-1.5 border-b-gray-300 py-4"}>
            <h3 className={"text-2xl font-semibold"}>Користувач</h3>
        </header>
    )
}