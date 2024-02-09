import { _removeFromCart } from "./impl/cart-delete-service";
import { _fetchById } from "./impl/cart-fetch-service";
import {
  _addToCart,
  _changeCartItemQuantity,
  _createCart,
} from "./impl/cart-write-service";

export const CartIncludes = {
  cartItems: {
    include: {
      variant: {
        include: {
          size: true,
          color: true,
          product: true,
          mediaUrls: true,
        },
      },
    },
  },
};

export class CartService {
  public createCart = _createCart;
  public fetchById = _fetchById;
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
