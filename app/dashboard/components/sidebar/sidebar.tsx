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

export function Sidebar() {
  const items = [
    {
      icon: <Tag />,
      name: "Товари",
      href: "/dashboard/products",
    },
    {
      icon: <Palette />,
      name: "Кольори",
      href: "/dashboard/colors",
    },
    {
      icon: <Ruler />,
      name: "Розміри",
      href: "/dashboard/sizes",
    },
    {
      icon: <ListTree />,
      name: "Категорії",
      href: "/dashboard/categories",
    },
    {
      icon: <LayoutDashboard />,
      name: "Банери",
      href: "/dashboard/banners",
    },
    {
      icon: <MessageSquare />,
      name: "Відгуки",
      href: "/dashboard/reviews",
    },
    {
      icon: <Package />,
      name: "Замовлення",
      href: "/dashboard/orders",
    },
    {
      icon: <User />,
      name: "Користувачі",
      href: "/dashboard/users",
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
        return <SidebarItem key={idx} {...item} />;
      })}
    </aside>
  );
}
