"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type SidebarItemProps = {
  icon: ReactNode;
  name: string;
  href: string;
};

export function SidebarItem({ icon, name, href }: SidebarItemProps) {
  const pathName = usePathname();
  const isActive = pathName.startsWith(href);

  return (
    <Link href={href}>
      <div
        className={`flex items-center transition-colors ${
          isActive && "bg-zinc-200 font-bold"
        } hover:bg-zinc-200 py-3 pl-6 pr-4 font-semibold relative`}
      >
        {icon}
        <p className={"text-lg ml-3"}>{name}</p>

        {isActive && (
          <span
            className={"absolute right-0 top-0 h-full w-[2px] bg-zinc-600"}
          ></span>
        )}
      </div>
    </Link>
  );
}
