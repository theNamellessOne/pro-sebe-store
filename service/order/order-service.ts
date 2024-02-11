import { _fetchOrders } from "./impl/order-fetch-service";
import { _confirmOrder, _placeOrder } from "./impl/order-write-service";

export class OrderService {
  public fetch = _fetchOrders;
  public placeOrder = _placeOrder;
  public confirmOrder = _confirmOrder;

  private static _instance: OrderService | undefined;

  static get instance() {
    if (!OrderService._instance) {
      OrderService._instance = new OrderService();
    }

    return OrderService._instance;
  }
}
