import { FooterIcons } from "./footer-icons";

import React from "react";
import { FooterLogo } from "./footer-logo";

export function Footer() {
  return (
    <footer
      className={"bg-secondary py-8 px-4 md:px-8 border-1 border-t-primary/60"}
    >
      <div
        className={
          "container mx-auto flex flex-col md:flex-row items-center justify-between gap-4"
        }
      >
        <FooterLogo />
        <FooterIcons />
      </div>
    </footer>
  );
}

export default Footer;
