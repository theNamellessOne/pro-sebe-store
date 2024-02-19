"use client";

import { determine } from "@/app/components/protected-component";
import { AuthService } from "@/service/auth/auth-service";
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
} from "@nextui-org/react";
import { LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { GoGear } from "react-icons/go";
import { PiUser } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";

export function UserMenu() {
  const session = useSession();

  return (
    <Dropdown
      classNames={{
        content: "rounded-sm",
      }}
    >
      <DropdownTrigger>
        <Button
          color="primary"
          variant="light"
          size="md"
          isIconOnly
          className="rounded-sm"
        >
          <PiUser className={"w-6 h-6 scale-105"} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem className="rounded-sm">
          <Link href={"/user-page"} className={"flex gap-4 items-center "}>
            <GoGear className={"w-5 h-5"} />
            Аккаунт
          </Link>
        </DropdownItem>

        <DropdownItem className="rounded-sm">
          {determine("PACKAGER", session.data?.user.role) ? (
            <Link
              href={"/dashboard/orders"}
              className={"flex gap-4 items-center"}
            >
              <RxDashboard className={"w-5 h-5"} />
              Адмін Панель
            </Link>
          ) : (
            <Divider />
          )}
        </DropdownItem>

        <DropdownItem className="rounded-sm">
          <p
            onClick={() => AuthService.instance.logout()}
            className={
              "text-danger relative tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-medium no-underline hover:opacity-80 active:opacity-disabled transition-opacity flex gap-4 items-center"
            }
          >
            <LogOut className={"w-5 h-5"} />
            Вийти
          </p>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
