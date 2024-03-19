import { useContext } from "react";
import { CartContext } from "../providers/cart-provider";

export function useCart() {
  return useContext(CartContext);
}
