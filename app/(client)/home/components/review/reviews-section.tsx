import { ReviewSwiper } from "./reviews-swiper";
import { ReviewForm } from "./review-form";
import Image from "next/image";

import s from "@/public/images/for-her.png";
import { Button } from "@/app/(client)/components/ui/button";
import Link from "next/link";
import { MiscService } from "@/service/misc/misc-service";

export async function ReviewSection() {
  const misc = await MiscService.instance.fetch();

  return (
    <div className={"container my-16 mx-auto flex flex-col lg:flex-row gap-4"}>
      <div
        className={
          "lg:w-1/2 h-auto relative rounded-sm overflow-hidden min-h-[400px]"
        }
      >
        <Image
          src={misc ? misc.imageUrl : s}
          alt={""}
          fill
          className={"object-cover "}
        />
        <Link href={"/catalogue"} className={"absolute top-3/4 left-0 z-40"}>
          <Button type={"primary"} className={"hover:bg-white"}>
            Переглянути новинки
          </Button>
        </Link>
      </div>

      <div className={"px-4 lg:p-0 lg:w-1/2"}>
        <h2 className={"text-xl py-8 mx-auto w-fit lg:text-2xl"}>
          Останні відгуки
        </h2>
        <ReviewSwiper />
        <ReviewForm />
      </div>
    </div>
  );
}
