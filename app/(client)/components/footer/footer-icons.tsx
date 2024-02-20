import { FaFacebook } from "react-icons/fa";
import { SiTelegram } from "react-icons/si";
import { FaInstagram } from "react-icons/fa6";

export function FooterIcons() {
  return (
    <div className={"flex gap-4 p-2 items-center"}>
      <a
        href="https://t.me/pro_sebe_store"
        target="_blank"
        className={
          "text-primary transition-colors rounded-full hover:text-primary/80"
        }
      >
        <SiTelegram className={"w-8 h-8"} />
      </a>

      <a
        href="https://www.instagram.com/pro.sebe.store/"
        target="_blank"
        className={
          "scale-110  text-primary transition-colors rounded-full hover:text-primary/80"
        }
      >
        <FaInstagram className={"w-8 h-8"} />
      </a>

      <a
        href="https://facebook.com"
        target="_blank"
        className={
          "text-primary transition-colors rounded-full hover:text-primary/80"
        }
      >
        <FaFacebook className={"w-8 h-8"} />
      </a>
    </div>
  );
}
