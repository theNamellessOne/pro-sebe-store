import Loading from "@/app/loading";
import { CartService } from "@/service/cart/cart-service";
import Link from "next/link";
import { ReactNode, createContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/app/(client)/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

export const CartContext = createContext<CartContext | undefined>(undefined);

type CartContext = {
  cart: any;
  isLoading: boolean;
  isInCart: (id: string) => boolean;
  addToCart: (
    id: string,
    data: {
      imgUrl: string;
      name: string;
      priceText: string;
    },
  ) => void;
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

  const addToCart = (
    id: string,
    data: { imgUrl: string; name: string; priceText: string },
  ) => {
    if (!cart) return;

    setIsLoading(true);
    CartService.instance
      .addToCart(cart.id, id, 1)
      .then((res) => {
        if (res.errMsg) toast.error(res.errMsg);
        if (!res.errMsg) {
          toast(
            () => {
              return (
                <div className={"flex flex-col gap-4"}>
                  <Image src={data.imgUrl} alt={""} height={300} width={300} />

                  <div className={"flex items-center justify-between"}>
                    <p className={"uppercase"}>{data.name}</p>
                    <p>{data.priceText}</p>
                  </div>

                  <Link href={"/cart"}>
                    <button
                      className={
                        "relative overflow-hidden transition-colors border border-black text-lg py-2 px-10 rounded-sm " +
                        "w-full text-secondary"
                      }
                    >
                      <motion.span
                        initial={{ x: 0 }}
                        animate={{ x: "-100%" }}
                        transition={{ duration: 4 }}
                        className={
                          "absolute w-full h-full top-0 left-0 bg-black -z-10"
                        }
                      ></motion.span>

                      <span
                        className={
                          "absolute w-full h-full top-0 left-0 bg-primary/90 -z-20"
                        }
                      ></span>

                      <p className={"relative z-10"}>До Корзини</p>
                    </button>
                  </Link>
                </div>
              );
            },
            {
              duration: 4000,
              style: {
                borderRadius: "0.125rem",
              },
            },
          );

          setCart(res.value);
        }
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