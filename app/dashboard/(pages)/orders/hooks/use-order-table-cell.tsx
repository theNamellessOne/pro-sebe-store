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
          case "POSTPAID":
            c = "blue";
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
      case "total":
        return <p>{order.total.toString()} UAH</p>;
      default:
        //@ts-ignore
        return order[columnKey];
    }
  }, []);
}
