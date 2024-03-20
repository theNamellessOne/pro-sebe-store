import { Button } from "@/app/(client)/components/ui/button";
import { TranslatedStatuses } from "@/app/dashboard/(pages)/orders/const/transl";
import { Divider } from "@nextui-org/react";
import { Order, OrderItem } from "@prisma/client";
import Image from "next/image";
import { UserOrderModal } from "./user-order-modal";

export function UserOrder(order: Order & { orderItems: OrderItem[] }) {
  return (
    <div className={"w-full p-4 rounded-sm bg-secondary/30"}>
      <div className={"flex justify-between text-primary/75 text-sm"}>
        <div className={"flex flex-col gap-1"}>
          <div className={"flex gap-2"}>
            <p>{order.id}</p>
          </div>

          <p className={"text-medium font-bold text-primary"}>
            {order.total.toString()} UAH
          </p>
        </div>

        <p>{order.createdAt.toLocaleString()}</p>
      </div>

      <Divider className={"my-2"} />

      <div className={"w-full flex justify-between items-center"}>
        <p>Статус</p>
        <p>{TranslatedStatuses[order.status]}</p>
      </div>

      <div className={"flex flex-wrap gap-2 my-3"}>
        {order.orderItems.map((item) => {
          return (
            <Image
              src={item.variantImgUrl}
              alt={"img"}
              height={100}
              width={100}
              className={"rounded-sm"}
            />
          );
        })}
      </div>

      <UserOrderModal order={order} />

      <Divider className={"my-4"} />
    </div>
  );
}
