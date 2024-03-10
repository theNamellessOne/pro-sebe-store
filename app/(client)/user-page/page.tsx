"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { UserDataTab } from "./components/user-data-tab/user-data-tab";
import { UserFavoritesTab } from "./components/user-favorites-tab/user-favorites-tab";
import { UserOrdersTab } from "./components/user-orders-tab/user-orders-tab";

export default function UserPage() {
  return (
    <div className={"container mx-auto flex flex-col p-4"}>
      <Tabs
        size={"lg"}
        variant={"underlined"}
        aria-label="delivery options"
        classNames={{ panel: "pl-3 -mt-3" }}
      >
        <Tab key={"user-data"} title={"Мої дані"}>
          <UserDataTab />
        </Tab>
        <Tab key={"user-favorites"} title={"Обарні товари"}>
          <UserFavoritesTab />
        </Tab>
        <Tab key={"user-orders"} title={"Мої замовлення"}>
          <UserOrdersTab />
        </Tab>
      </Tabs>
    </div>
  );
}
