import { FooterIcons } from "./footer-icons";

import React from "react";
import { FooterLogo } from "./footer-logo";

export function Footer() {
  return (
    <footer className={"bg-primary py-8 px-4 md:px-8"}>
      <div
        className={
          "container flex flex-col md:flex-row items-center justify-between gap-4"
        }
      >
        <FooterLogo />
        <FooterIcons />
      </div>
    </footer>
  );
}

export default Footer;
