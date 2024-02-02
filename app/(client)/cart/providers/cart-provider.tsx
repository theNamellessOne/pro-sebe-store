import { ReactNode, createContext, useEffect, useState } from "react";

export const CartContext = createContext<CartContext | undefined>(undefined);

type CartContext = {
  cart: Cart;
  isInCart: (id: number) => boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  changeItemAmount: (id: number, newAmount: number) => void;
};

export type CartItem = {
  id: number;

  productName: string;
  productImageUrl: string;

  sizeName: string;
  colorName: string;

  unitPrice: number;
};

export type CartItemWithAmount = CartItem & { amount: number };

type Cart = {
  items: CartItemWithAmount[];
  total: number;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
  });

  const isInCart = (id: number) => {
    return cart.items.filter((item) => item.id === id).length === 0;
  };

  const calculateTotal = (cartItems: CartItemWithAmount[]) => {
    if (cartItems.length === 0) return 0;

    return cartItems
      .map((item: CartItemWithAmount) => item.unitPrice * item.amount)
      .reduce((accumulator, current) => accumulator + current);
  };

  const changeCart = (newCart: Cart) => {
    console.log(newCart);
    setCart({ ...newCart });
    window.localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const addToCart = (item: CartItem) => {
    const items = [...cart.items, { ...item, amount: 1 }];
    const total = calculateTotal(items);

    changeCart({ items, total });
  };

  const removeFromCart = (id: number) => {
    const items = cart.items.filter((item) => item.id !== id);
    const total = calculateTotal(items);

    changeCart({ items, total });
  };

  const changeItemAmount = (id: number, newAmount: number) => {
    const items = cart.items.map((item) => {
      if (item.id === id) {
        return { ...item, amount: newAmount };
      }

      return item;
    });
    const total = calculateTotal(items);

    changeCart({ items, total });
  };

  useEffect(() => {
    const cartStr = window.localStorage.getItem("cart");

    if (!cartStr) return;

    const parsedCart = JSON.parse(cartStr);

    if ("items" in parsedCart && "total" in parsedCart) {
      setCart(parsedCart);
    } else {
      setCart({ items: [], total: 0 });
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        isInCart,
        addToCart,
        removeFromCart,
        changeItemAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
