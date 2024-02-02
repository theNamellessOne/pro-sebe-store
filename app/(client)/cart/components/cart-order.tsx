import { Button } from "@nextui-org/react";
import { useCart } from "../hooks/use-cart";

export function CartOrder() {
  const { cart } = useCart()!;

  return (
    <div className="bg-secondary h-full py-8 px-8 lg:pt-40 flex flex-col gap-12">
      <h2 className="text-lg lg:text-xl uppercase flex justify-between">
        <span>загальна сума</span>
        <span>{cart.total} UAH</span>
      </h2>

      <Button
        color="primary"
        size="lg"
        className="rounded-sm text-lg lg:text-xl uppercase"
      >
        перейти до оформлення
      </Button>
    </div>
  );
}
