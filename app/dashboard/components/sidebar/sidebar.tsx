"use client";

import {
  LayoutDashboard,
  ListTree,
  MessageSquare,
  Package,
  Palette,
  Ruler,
  Tag,
  User,
} from "lucide-react";
import React from "react";
import { SidebarItem } from "@/app/dashboard/components/sidebar/sidebar-item";
import { ClientProtectedComponent } from "@/app/dashboard/components/protected-component";
import { Role } from "@prisma/client";

export function Sidebar() {
  const items = [
    {
      icon: <Tag />,
      name: "Товари",
      href: "/dashboard/products",
      role: Role.MODERATOR,
    },
    {
      icon: <Palette />,
      name: "Кольори",
      href: "/dashboard/colors",
      role: Role.MODERATOR,
    },
    {
      icon: <Ruler />,
      name: "Розміри",
      href: "/dashboard/sizes",
      role: Role.MODERATOR,
    },
    {
      icon: <ListTree />,
      name: "Категорії",
      href: "/dashboard/categories",
      role: Role.MODERATOR,
    },
    {
      icon: <LayoutDashboard />,
      name: "Банери",
      href: "/dashboard/banners",
      role: Role.MODERATOR,
    },
    {
      icon: <MessageSquare />,
      name: "Відгуки",
      href: "/dashboard/reviews",
      role: Role.MODERATOR,
    },
    {
      icon: <Package />,
      name: "Замовлення",
      href: "/dashboard/orders",
      role: Role.PACKAGER,
    },
    {
      icon: <User />,
      name: "Користувачі",
      href: "/dashboard/users",
      role: Role.OWNER,
    },
  ];

  return (
    <aside
      className={
        "flex flex-col h-full overflow-y-auto fixed py-6 w-[250px] border-r border-r-zinc-700 border-r-0.5"
      }
    >
      <h2 className={"text-4xl pl-6 mb-6"}>/logan</h2>
      {items.map((item, idx) => {
        return (
          <ClientProtectedComponent key={idx} minimumRequiredRole={item.role}>
            <SidebarItem {...item} />
          </ClientProtectedComponent>
        );
      })}
    </aside>
  );
}
