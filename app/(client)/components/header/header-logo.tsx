import Image from "next/image";
import Link from "next/link";
import React from "react";
import HeaderLogoImage from "@/public/images/logo.png";

export function HeaderLogo() {
  return (
    <Link href={"/home"} className={"py-3"}>
      <Image
        className={"block sm:hidden"}
        src={HeaderLogoImage}
        alt={"logo"}
        height={"40"}
      />

      <Image
        className={"hidden sm:block lg:hidden"}
        src={HeaderLogoImage}
        alt={"logo"}
        height={"50"}
      />

      <Image
        className={"hidden lg:block"}
        src={HeaderLogoImage}
        alt={"logo"}
        height={"60"}
      />
    </Link>
  );
}
