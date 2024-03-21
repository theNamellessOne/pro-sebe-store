import { OrderItem } from "@prisma/client";
import Image from "next/image";

export function OrderProductItem({ item }: { item: OrderItem }) {
  return (
    <div className={"flex gap-4 relative"}>
      <div
        className={
          "hidden sm:block relative shrink-0 overflow-hidden rounded-sm"
        }
      >
        <Image
          className={"object-cover h-[200px] w-[200px]"}
          width={200}
          height={200}
          src={
            item.variantImgUrl
              ? item.variantImgUrl
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
              item.variantImgUrl
                ? item.variantImgUrl
                : "https://utfs.io/f/9f49f263-2475-45a1-8770-479fd5cb0c80-9w6i5v.png"
            }
            alt={"media"}
          />
        </div>

        <h3 className={"font-semibold max-w-[300px]"}>{item.productName}</h3>
        <p className={"text-[#808080] text-sm -mt-2"}>{item.productArticle}</p>

        <div className={"grid grid-cols-2 gap-4"}>
          <p>Колір</p>
          <p>{item.variantName.split("/")[0]}</p>
        </div>

        <div className={"grid grid-cols-2 gap-4"}>
          <p>Розмір</p>
          <p>{item.variantName.split("/")[1]}</p>
        </div>

        <div className={"grid grid-cols-2 gap-4"}>
          <p>Ціна</p>
          <p>{item.subtotal.toString()} UAH</p>
        </div>

        <div className={"grid grid-cols-2 gap-4"}>
          <p>К-сть</p>
          <p>{item.quantity} шт.</p>
        </div>
      </div>
    </div>
  );
}
