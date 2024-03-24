import { Key, useCallback } from "react";
import { Order, OrderPaymentType, OrderStatus } from "@prisma/client";
import { ViewOrderModal } from "../modals/view-order-modal";
import { TranslatedPaymentTypes, TranslatedStatuses } from "../const/transl";
import { ColorMessage } from "@/app/dashboard/components/colored-message";

export function useOrderTableCell() {
  return useCallback((order: Order, columnKey: Key) => {
    switch (columnKey) {
      case "actions":
        return <ViewOrderModal order={order} />;

      case "paymentType":
        let c = "yellow";
        switch (order.paymentType) {
          case "PREPAID":
            c = "green";
            break;
          case "POSTPAID":
            c = "blue";
            break;
        }

        return (
          <ColorMessage
            text={TranslatedPaymentTypes[order.paymentType as OrderPaymentType]}
            //@ts-ignore
            color={c}
            classNames={{
              wrapper: "p-3 rounded-medium",
              inner: "font-semibold",
            }}
          />
        );

      case "status":
        let color = "red";

        switch (order.status) {
          case "DELIVERED":
          case "PACKED":
            color = "green";
            break;
          case "PAID":
            color = "blue";
            break;
          case "CREATED":
            color = "yellow";
            break;
        }

        return (
          <ColorMessage
            text={TranslatedStatuses[order.status as OrderStatus]}
            //@ts-ignore
            color={color}
            classNames={{
              wrapper: "p-3 rounded-medium",
              inner: "font-semibold",
            }}
          />
        );
      case "fullName":
        return (
          <p>
            {order.name} {order.surname} {order.middlename}
          </p>
        );
      case "address":
        return (
          <p>
            <span>{order.postalIdx}</span>
            {order.orderDeliveryType === "COURIER" ? (
              <span>
                {order.street}, {order.houseNo}
              </span>
            ) : (
              <span>вiддiлення {order.warehouseKey}</span>
            )}
            {", "}
            <span>{order.settlementDescription}</span>
          </p>
        );
      case "createdAt":
        return (
          <p>
            {Intl.DateTimeFormat("ua", {
              dateStyle: "short",
              timeStyle: "long",
              hour12: false,
              timeZone: "Europe/Kyiv",
            }).format(order.createdAt)}
          </p>
        );
      case "total":
        return <p>{order.total.toString()} UAH</p>;
      default:
        //@ts-ignore
        return order[columnKey];
    }
  }, []);
}
