import { Key, useCallback } from "react";
import { Order, OrderDeliveryType, Review } from "@prisma/client";

export function useOrderTableCell() {
  return useCallback((order: Order, columnKey: Key) => {
    console.log(order);
    switch (columnKey) {
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
