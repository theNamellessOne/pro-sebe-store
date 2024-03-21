import Image from "next/image";
import { Divider } from "@nextui-org/react";
import { Button } from "../components/ui/button";
import Packages from "@/public/images/about/delivery.jpeg";
import FounderWithPackages from "@/public/images/about/with_packages.jpeg";
import Founder3 from "@/public/images/about/founder_3.jpeg";
import { Link } from "@nextui-org/react";
import { FadeInWhenVisible } from "./components/animation/fade-in-when-visible";

export default function Page() {
  return (
    <div className={"container mx-auto flex flex-col gap-8 mt-0 md:mt-8 my-8"}>
      <FadeInWhenVisible>
        <div className={"w-full rounded-small"}>
          <div className={"flex flex-col md:flex-row gap-8"}>
            <div className={"flex flex-col gap-8 p-8"}>
              <h2 className={"text-xl font-light uppercase"}>хто ми?</h2>
              <p>
                Pro Sebe Store - офіційний магазин спідньої білизни з унікальним
                асортиментом та доступними цінами.
              </p>

              <p>
                У нас якісний сервіс та професійний підхід до підбору зручної
                білизни.
              </p>

              <Link href={"/catalogue"} className={"mt-auto "}>
                <Button type={"primary"} className={"w-fit uppercase"}>
                  наш асортимент
                </Button>
              </Link>
            </div>

            <FadeInWhenVisible>
              <Image
                src={Founder3}
                alt={"founder image"}
                width={400}
                className={"rounded-sm w-full md:w-auto md:max-w-[384px]"}
              />
            </FadeInWhenVisible>
          </div>
        </div>
      </FadeInWhenVisible>

      <FadeInWhenVisible>
        <div className={"w-full rounded-small bg-secondary/30"}>
          <div className={"flex flex-col md:flex-row-reverse gap-8"}>
            <div className={"flex flex-col gap-8 p-8"}>
              <h2 className={"text-xl font-light uppercase"}>
                чому обирають нас?
              </h2>

              <p>
                Наша команда добре знає, що Тобі потрібно для справжнього
                жіночого щастя.
              </p>

              <p>
                Зроби замовлення онлайн прямо зараз і вже завтра отримаєш свій
                пакуночок з сердечками ❤️
              </p>

              <Link href={"/catalogue"} className={"mt-auto "}>
                <Button type={"primary"} className={"w-fit uppercase"}>
                  наш асортимент
                </Button>
              </Link>
            </div>

            <FadeInWhenVisible>
              <Image
                src={FounderWithPackages}
                alt={"founder image"}
                width={400}
                className={"rounded-sm w-full md:w-auto md:max-w-[384px]"}
              />
            </FadeInWhenVisible>
          </div>
        </div>
      </FadeInWhenVisible>

      <FadeInWhenVisible>
        <div className={"w-full rounded-small"}>
          <div className={"flex flex-col md:flex-row gap-8"}>
            <div className={"flex flex-col gap-8 p-8"}>
              <h2 className={"text-xl font-light uppercase"}>
                Твоя ідеальна білизна
              </h2>

              <p>
                Ми вкладаємо душу і тепло у кожну посилочку, а постійним
                клієнтам даруємо знижки.
              </p>

              <p>
                Завжди раді бачити Тебе на нашому сайті або на сторінці
                Інстаграм{" "}
                <Link
                  href={"https://www.instagram.com/pro.sebe.store/"}
                  underline="hover"
                  isExternal
                >
                  @pro.sebe.store
                </Link>
              </p>

              <Link href={"/catalogue"} className={"mt-auto "}>
                <Button type={"primary"} className={"w-fit uppercase"}>
                  наш асортимент
                </Button>
              </Link>
            </div>

            <FadeInWhenVisible>
              <Image
                src={Packages}
                alt={"founder image"}
                width={400}
                className={"rounded-sm w-full md:w-auto md:max-w-[384px]"}
              />
            </FadeInWhenVisible>
          </div>
        </div>
      </FadeInWhenVisible>
    </div>
  );
}
