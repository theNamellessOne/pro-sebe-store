"use client";

import { Button } from "@nextui-org/react";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsBag } from "react-icons/bs";
import { PiUser } from "react-icons/pi";
import { useCart } from "../../cart/hooks/use-cart";
import { UserMenu } from "../user-menu";
import { headerEventChannel } from "./events/header-event-channel";

export function HeaderIcons() {
  const { cart } = useCart()!;
  const session = useSession();
  const router = useRouter();

  return (
    <div className="items-center gap-2 scale-95 sm:scale-100 flex-1 flex justify-end">
      <Button
        color="primary"
        variant="light"
        size="md"
        isIconOnly
        onClick={() => headerEventChannel.emit("onSeachIconPress")}
        className="rounded-sm"
      >
        <Search className={"w-6 h-6"} />
      </Button>

      {!session.data?.user.role ? (
        <Link href={"/auth/login"}>
          <Button
            color="primary"
            variant="light"
            size="md"
            isIconOnly
            className="rounded-sm"
          >
            <PiUser className={"w-6 h-6 scale-105"} />
          </Button>
        </Link>
      ) : (
        <UserMenu />
      )}

      <Link href={"/cart"} className={"relative"}>
        <Button
          color="primary"
          variant="light"
          size="md"
          isIconOnly
          className="rounded-sm"
        >
          <BsBag className={"w-6 h-6 scale-95"} />
        </Button>

        {cart?.cartItems.length > 0 && (
          <span
            className={
              "absolute -bottom-0 -right-0 text-sm bg-danger " +
              "text-danger-foreground rounded-full flex items-center justify-center w-5 h-5"
            }
          >
            <p className="mt-0.5">{cart?.cartItems.length}</p>
          </span>
        )}
      </Link>
    </div>
  );
}
