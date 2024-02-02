import { Button } from "@nextui-org/react";
import { useCart } from "../hooks/use-cart";

export function CartOrder() {
  const { cart } = useCart()!;

  return (
    <div className="bg-secondary">
      <h2 className="text-lg lg:text-xl uppercase flex justify-between">
        <span>загальна сума</span>
        <span>{cart.total} UAH</span>
      </h2>

      <Button
        color="primary"
        className="rounded-sm text-lg lg:text-xl uppercase"
      >
        перейти до оформлення
      </Button>
    </div>
  );
}
