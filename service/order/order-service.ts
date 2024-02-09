export class OrderService {
  private static _instance: OrderService | undefined;

  static get instance() {
    if (!OrderService._instance) {
      OrderService._instance = new OrderService();
    }

    return OrderService._instance;
  }
}
