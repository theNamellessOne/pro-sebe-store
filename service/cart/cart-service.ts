import { _removeFromCart } from "./impl/cart-delete-service";
import { _fetchAndCreate as fetchOrCreate } from "./impl/cart-fetch-service";
import {
  _addToCart,
  _changeCartItemQuantity,
  _createCart,
} from "./impl/cart-write-service";

export const CartIncludes = {
  cartItems: {
    include: {
      variant: {
        select: {
          id: true,
          name: true,
          quantity: true,
          reserved: true,

          product: {
            select: {
              name: true,
              price: true,
            },
          },
          mediaUrls: true,
        },
      },
    },
  },
};

export class CartService {
  public createCart = _createCart;
  public fetchOrCreate = fetchOrCreate;
  public addToCart = _addToCart;
  public removeFromCart = _removeFromCart;
  public chageCartItemQuantity = _changeCartItemQuantity;

  private static _instance: CartService | undefined;

  static get instance() {
    if (!CartService._instance) {
      CartService._instance = new CartService();
    }

    return CartService._instance;
  }
}
