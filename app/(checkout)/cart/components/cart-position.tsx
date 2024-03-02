import Image from "next/image";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { RxCross1 } from "react-icons/rx";
import { useCart } from "../hooks/use-cart";

export function CartPosition({ item }: any) {
  const { removeFromCart, changeItemAmount } = useCart()!;

  const itemVariant = item.variant;
  const colorName = itemVariant.name.split("/")[0];
  const sizeName = itemVariant.name.split("/")[1];

  return (
    <div className={"flex gap-4 relative"}>
      <div
        className={
          "hidden sm:block relative shrink-0 overflow-hidden rounded-sm"
        }
      >
        <Image
          className={"object-cover h-[200px] w-[200px]"}
          width={300}
          height={300}
          src={
            itemVariant.mediaUrls[0]
              ? itemVariant.mediaUrls[0]?.url
              : "https://utfs.io/f/9f49f263-2475-45a1-8770-479fd5cb0c80-9w6i5v.png"
          }
          alt={"media"}
        />
      </div>

      <div className={"flex flex-col gap-2 grow"}>
        <div className={"relative"}>
          <Image
            className={"block sm:hidden object-cover"}
            height={600}
            width={600}
            src={
              itemVariant.mediaUrls[0]
                ? itemVariant.mediaUrls[0]?.url
                : "https://utfs.io/f/9f49f263-2475-45a1-8770-479fd5cb0c80-9w6i5v.png"
            }
            alt={"media"}
          />

          <Button
            size="sm"
            variant="light"
            color="primary"
            onClick={() => removeFromCart(itemVariant.id)}
            className={"rounded-sm text-xl z-40 absolute -top-2 right-0"}
            isIconOnly
          >
            <RxCross1 />
          </Button>
        </div>

        <h3 className={"font-semibold max-w-[300px]"}>
          {itemVariant.product.name}
        </h3>

        <p className={"text-[#808080]"}>Колір: {colorName}</p>
        <p className={"text-[#808080]"}>Розмір {sizeName}</p>
        <p className={"text-[#808080]"}>
          Ціна: {itemVariant.product.price.toString()} UAH
        </p>
        <div className={"flex items-center gap-4"}>
          <p>К-сть:</p>
          <Select
            variant="bordered"
            color="primary"
            radius="none"
            size="sm"
            selectedKeys={[item.quantity.toString()]}
            defaultSelectedKeys={[item.quantity.toString()]}
            onChange={(e) => {
              if (!e.target.value) return;

              changeItemAmount(itemVariant.id, parseInt(e.target.value));
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
        Cума: {item.subtotal} UAH
      </p>
    </div>
  );
}
