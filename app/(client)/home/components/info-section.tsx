import { MiscService } from "@/service/misc/misc-service";
import PackageHand from "@/public/images/package_hand.svg";
import PriceTag from "@/public/images/price_tag.svg";
import DeliveryTruck from "@/public/images/delivery-truck.svg";
import Image from "next/image";

export async function InfoSection() {
  const misc = await MiscService.instance.fetch();

  const data = [
    {
      text: `Безкоштовна доставка від ${misc?.freeDeliveryMinPrice} грн`,
      icon: PackageHand,
    },
    {
      text: `- ${misc?.secondOrderDiscount}% на друге замовлення`,
      icon: PriceTag,
    },

    {
      text: `Відправляємо замовлення ${misc?.shipmentsPerDay} на день`,
      icon: DeliveryTruck,
    },
  ];

  return (
    <div className={"container mx-auto relative min-h-[180px] lg:min-h-[65px]"}>
      <div
        className={
          "md:absolute md:-top-24 bg-white z-40 flex flex-wrap w-full " +
          "rounded-sm p-8 md:p-16 gap-4"
        }
      >
        {data.map((datum, idx) => {
          return (
            <div key={idx} className={"flex items-center justify-center grow"}>
              <div className={"flex gap-4 max-w-[290px] w-full"}>
                <Image
                  className={"w-8 h-8 md:w-10 md:h-10"}
                  src={datum.icon}
                  alt={""}
                  height={60}
                  width={60}
                />
                <p className={"text-primary"}>{datum.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
