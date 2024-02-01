import Image from "next/image";
import { CartItemWithAmount } from "../hooks/use-cart";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { RxCross1 } from "react-icons/rx";

export function CartPosition({
  item,
  changeItemAmount,
  removeFromCart,
}: {
  item: CartItemWithAmount;
  changeItemAmount: (id: number, newAmount: number) => void;
  removeFromCart: (id: number) => void;
}) {
  return (
    <div className={"flex gap-4 relative"}>
      <Button
        size="sm"
        variant="ghost"
        color="primary"
        onClick={() => removeFromCart(item.id)}
        className={"rounded-sm text-xl absolute z-50 right-5"}
        isIconOnly
      >
        <RxCross1 />
      </Button>

      <div
        className={"relative h-[300px] w-[200px] overflow-hidden rounded-sm"}
      >
        <Image
          className={"aspect-[200/300] object-cover"}
          src={item.productImageUrl}
          alt={"media"}
          fill
        />
      </div>

      <div className={"flex flex-col gap-2"}>
        <h3 className={"font-semibold"}>{item.productName}</h3>
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
