import { HeaderIcons } from "./header-icons";
import { HeaderLinks } from "./header-links";
import { HeaderLogo } from "./header-logo";
import {Search} from "lucide-react"
import {Input} from "@nextui-org/input";
import React from "react";

export function Header() {
  return (
    <header className="bg-[#55585c] flex justify-between">
      <HeaderLinks />
      <HeaderLogo />
        <div className="flex flex-row justify-center align-middle m-0">
            <Input
                variant={"underlined"}
                type={"text"}
                label={"Пошук"}
            />
            <Search className="mt-6"/>
        </div>
      <HeaderIcons />
    </header>
  );
}
