"use client";

import {usePathname} from "next/navigation";
import Link from "next/link";

type UserPageSidebarItemProps = {
    name: string;
    href: string;
};

export function UserPageSidebarItem({name, href}: UserPageSidebarItemProps) {
    const pathName = usePathname();
    const isActive = pathName.startsWith(href);

    return (
        <Link href={href}>
            <div
                className={` items-center transition-colors ${
                    isActive && "font-semibold text-secondary-foreground underline"
                } hover: py-1 pr-4 relative `}
            >
                <p className={"text-lg ml-4 hover:underline"}>{name}</p>

                {isActive && (
                    <span
                        className={"absolute right-0 top-0 h-full w-[2px]"}
                    ></span>
                )}
            </div>
        </Link>
    );
}