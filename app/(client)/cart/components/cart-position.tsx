import Image from "next/image";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { RxCross1 } from "react-icons/rx";
import { CartItemWithAmount } from "../providers/cart-provider";
import { useCart } from "../hooks/use-cart";

type CartPositionProps = {
  item: CartItemWithAmount;
};

export function CartPosition({ item }: CartPositionProps) {
  const { removeFromCart, changeItemAmount } = useCart()!;

  return (
    <div className={"flex gap-4 relative"}>
      <div
        className={"hidden sm:block relative sm:h-[300px] sm:w-[200px] shrink-0 overflow-hidden rounded-sm"}
      >
        <Image
          className={"aspect-[200/300] object-cover"}
          src={item.productImageUrl}
          alt={"media"}
          fill
        />
      </div>

      <div className={"flex flex-col gap-2 grow"}>
        <div className="flex items-start gap-2 justify-between">
          <h3 className={"font-semibold max-w-[300px]"}>{item.productName}</h3>

          <Button
            size="sm"
            variant="light"
            color="primary"
            onClick={() => removeFromCart(item.id)}
            className={"rounded-sm text-xl z-50"}
            isIconOnly
          >
            <RxCross1 />
          </Button>
        </div>

        <p className={"text-[#808080]"}>Колір: {item.colorName}</p>
        <p className={"text-[#808080]"}>Розмір {item.sizeName}</p>
        <p className={"text-[#808080]"}>Ціна: {item.unitPrice} UAH</p>
        <div className={"flex items-center gap-4"}>
          <p>К-сть:</p>
          <Select
            variant="bordered"
            color="primary"
            radius="none"
            size="sm"
            selectedKeys={[item.amount.toString()]}
            defaultSelectedKeys={[item.amount.toString()]}
            onChange={(e) => {
              if (!e.target.value) return;

              changeItemAmount(item.id, parseInt(e.target.value));
            }}
            className={"w-[70px]"}
            classNames={{
              trigger:
                "shadow-none border-[#808080] text-[#808080] rounded-sm h-[30px] py-0! min-h-0",
              value: "text-primary",
              innerWrapper: "py-0!",
              selectorIcon: "scale-[1.3]",
              popoverContent: "rounded-sm",
            }}
          >
            {["1", "2", "3", "4", "5"].map((q) => {
              return (
                <SelectItem className={"rounded-sm"} key={q} value={q}>
                  {q}
                </SelectItem>
              );
            })}
          </Select>
        </div>
      </div>

      <p className={"absolute bottom-0 right-5 text-[#808080]"}>
        Cума: {item.amount * item.unitPrice} UAH
      </p>
    </div>
  );
}
