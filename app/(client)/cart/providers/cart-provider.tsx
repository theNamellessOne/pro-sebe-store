import Loading from "@/app/loading";
import { CartService } from "@/service/cart/cart-service";
import { ReactNode, createContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export const CartContext = createContext<CartContext | undefined>(undefined);

type CartContext = {
  cart: any;
  isLoading: boolean;
  isInCart: (id: string) => boolean;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  changeItemAmount: (id: string, newAmount: number) => void;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<any>();

  const isInCart = (id: string) => {
    if (!cart) return false;

    return (
      cart?.cartItems.filter((item: any) => item.variantId === id).length === 0
    );
  };

  const addToCart = (id: string) => {
    if (!cart) return;

    setIsLoading(true);
    CartService.instance
      .addToCart(cart.id, id, 1)
      .then((res) => {
        if (res.errMsg) toast.error(res.errMsg);
        if (!res.errMsg) setCart(res.value);
      })
      .finally(() => setIsLoading(false));
  };

  const removeFromCart = (id: string) => {
    if (!cart) return;

    setIsLoading(true);
    CartService.instance
      .removeFromCart(cart.id, id)
      .then((res) => {
        if (res.errMsg) toast.error(res.errMsg);
        if (!res.errMsg) setCart(res.value);
      })
      .finally(() => setIsLoading(false));
  };

  const changeItemAmount = (id: string, newQuantity: number) => {
    if (!cart) return;

    setIsLoading(true);
    CartService.instance
      .chageCartItemQuantity(cart.id, id, newQuantity)
      .then((res) => {
        if (res.errMsg) toast.error(res.errMsg);
        if (!res.errMsg) setCart(res.value);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsLoading(true);
    CartService.instance
      .fetchOrCreate(window.localStorage.getItem("cuid") ?? "")
      .then((res) => {
        window.localStorage.setItem("cuid", res.id);
        setCart(res);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isInCart,
        addToCart,
        removeFromCart,
        changeItemAmount,
      }}
    >
      {isLoading && <Loading />}
      {children}
      <Toaster />
    </CartContext.Provider>
  );
}
