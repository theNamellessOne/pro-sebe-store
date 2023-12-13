"use client";

import {
  LayoutDashboard,
  ListTree,
  MessageSquare,
  Package,
  Palette,
  Ruler,
  Tag,
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
  ];

  return (
    <aside
      className={
        "flex flex-col fixed py-4 w-[250px] h-screen border-r border-r-0.5"
      }
    >
      <h2 className={"text-4xl pl-6 mb-4"}>/logan</h2>
      {items.map((item, idx) => {
        return <SidebarItem key={idx} {...item} />;
      })}
    </aside>
  );
}
