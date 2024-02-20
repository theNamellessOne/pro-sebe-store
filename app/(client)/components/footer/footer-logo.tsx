import Image from "next/image";
import Link from "next/link";
import FooterLogoImage from "@/public/images/logo-light.png";

export function FooterLogo() {
  return (
    <Link href={"/home"} className={"py-3"}>
      <Image src={FooterLogoImage} alt={"logo"} height={"70"} />
    </Link>
  );
}
