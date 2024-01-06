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
          isActive && "bg-zinc-800 font-semibold text-primary"
        } hover:bg-zinc-800 py-4 pl-6 pr-4 relative`}
      >
        {icon}
        <p className={"text-lg ml-4"}>{name}</p>

        {isActive && (
          <span
            className={"absolute right-0 top-0 h-full w-[2px] bg-primary"}
          ></span>
        )}
      </div>
    </Link>
  );
}
