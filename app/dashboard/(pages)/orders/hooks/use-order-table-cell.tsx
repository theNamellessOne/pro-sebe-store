import { Key, useCallback } from "react";
import { Order, OrderDeliveryType } from "@prisma/client";
import { ViewOrderModal } from "@/app/dashboard/(pages)/orders/modals/view-order-modal";

export function useOrderTableCell() {
  return useCallback((order: Order, columnKey: Key) => {
    switch (columnKey) {
      case "actions":
        return <ViewOrderModal order={order} />;

      case "contactInfo":
        return (
          <p>
            {order.name} {order.surname} {order.middlename}
            <br />
            {order.email}
            <br />
            {order.phone}
          </p>
        );
      case "deliveryInfo":
        return (
          <p>
            {order.settlementRef}
            <br />
            {order.orderDeliveryType === OrderDeliveryType.COURIER && (
              <span>
                {order.street}
                <br />
                {order.houseNo}
                <br />
                {order.postalIdx}
              </span>
            )}

            {order.orderDeliveryType === OrderDeliveryType.WAREHOUSE && (
              <span>{order.warehouseKey}</span>
            )}
          </p>
        );
      default:
        //@ts-ignore
        return order[columnKey];
    }
  }, []);
}
