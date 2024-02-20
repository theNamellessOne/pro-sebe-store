import Link from "next/link";
import { HeaderMobileMenu } from "./header-mobile-menu";
import { CategoryWithChildren } from "./header-categories";

export function HeaderLinks({
  categories,
}: {
  categories: CategoryWithChildren[];
}) {
  return (
    <>
      <div
        className={
          "hidden lg:flex text-primary text-medium " +
          "uppercase items-center gap-4 mr-auto flex-1"
        }
      >
        <HeaderLink text={"Каталог"} href={"/catalogue"} />
        <HeaderLink text={"Вiдгуки"} href={"/catalogue"} />
        <HeaderLink text={"Про нас"} href={"/catalogue"} />
      </div>

      <div
        className={
          "flex lg:hidden text-primary text-medium font-bold uppercase items-center gap-4"
        }
      >
        <HeaderMobileMenu categories={categories} />
      </div>
    </>
  );
}

export const HeaderLink = ({
  text,
  href,
  className = "",
  onClick = () => {},
}: {
  text: string;
  href: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <Link
      href={href}
      className={"hover:text-primary relative group " + className}
      onClick={onClick}
    >
      {text}
      <span
        className={
          "absolute bg-primary -bottom-1 left-0 h-px w-0 " +
          "group-hover:w-full transition-all "
        }
      ></span>
    </Link>
  );
};
