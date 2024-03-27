"use client";

import {
  Home,
  LayoutDashboard,
  ListTree,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  Package,
  Palette,
  Ruler,
  Tag,
  User,
} from "lucide-react";
import React from "react";
import { SidebarItem } from "@/app/dashboard/components/sidebar/sidebar-item";
import { ClientProtectedComponent } from "@/app/components/protected-component";
import { Role } from "@prisma/client";
import { Button } from "@nextui-org/button";
import { AuthService } from "@/service/auth/auth-service";
import {HeaderLogo} from "@/app/(client)/components/header/header-logo";

export const dashboardMenuItems = [
  {
    icon: <Home />,
    name: "Головна",
    href: "/home",
    role: Role.USER,
  },
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
    href: "/dashboard/review",
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
  {
    icon: <MoreHorizontal />,
    name: "Рiзне",
    href: "/dashboard/misc",
    role: Role.OWNER,
  },
];

export function Sidebar() {
  return (
    <aside
      className={
        "flex flex-col h-full top-0 overflow-y-auto fixed py-6 w-[250px] border-r border-r-secondary border-r-0.5"
      }
    >
      <HeaderLogo/>

      {dashboardMenuItems.map((item, idx) => {
        return (
          <ClientProtectedComponent key={idx} minimumRequiredRole={item.role}>
            <SidebarItem {...item} />
          </ClientProtectedComponent>
        );
      })}

      <div className={"bottom-0 w-full mt-auto ml-2"}>
        <Button
          color={"danger"}
          variant={"light"}
          onClick={() => {
            AuthService.instance.logout();
          }}
        >
          <LogOut /> Вийти
        </Button>
      </div>
    </aside>
  );
}
