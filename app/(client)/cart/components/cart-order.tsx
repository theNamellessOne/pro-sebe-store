import Link from "next/link";
import { Button } from "../../components/ui/button";
import { useCart } from "../hooks/use-cart";

export function CartOrder() {
  const { cart } = useCart()!;

  return (
    <div
      className={
        "bg-secondary h-full py-8 px-8 lg:pt-40 flex flex-col gap-12 " +
        "lg:fixed lg:bottom-0 lg:top-0 lg:right-0 lg:w-2/5"
      }
    >
      <h2 className="lg:text-lg uppercase flex justify-between">
        <span>загальна сума</span>
        <span>{cart?.subtotal} UAH</span>
      </h2>

      <Button type="primary" className="uppercase">
        <Link href="/checkout" className="text-center">
          перейти до оформлення
        </Link>
      </Button>
    </div>
  );
}
