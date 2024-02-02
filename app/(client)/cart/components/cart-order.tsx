import { Button } from "../../components/ui/button";
import { useCart } from "../hooks/use-cart";

export function CartOrder() {
  const { cart } = useCart()!;

  return (
    <div className="bg-secondary h-full py-8 px-8 lg:pt-40 flex flex-col gap-12">
      <h2 className="lg:text-lg uppercase flex justify-between">
        <span>загальна сума</span>
        <span>{cart.total} UAH</span>
      </h2>

      <Button type="primary" className="uppercase">
        перейти до оформлення
      </Button>
    </div>
  );
}
