"use client";

import { HeaderIcons } from "./header-icons";
import { HeaderLinks } from "./header-links";
import { HeaderLogo } from "./header-logo";
import { HeaderCategories } from "./header-categories";
import { HeaderSearch } from "./header-search";
import { CategoryService } from "@/service/category/category-service";
import { useEffect, useRef, useState } from "react";
import { headerEventChannel } from "./events/header-event-channel";

export function Header() {
  const [categories, setCategories] = useState<any>([]);

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 50);

      if (!visible) headerEventChannel.emit("onHeaderHide");

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const elementRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (elementRef.current) {
      const elementHeight = elementRef.current.scrollHeight;
      setHeight(elementHeight);
    }
  }, [categories]);

  useEffect(() => {
    CategoryService.instance.fetchTree().then(setCategories);
  }, []);

  return (
    <>
      <div
        ref={elementRef}
        className={
          `w-full fixed bg-white transition-all z-[45] ` +
          `${visible ? "translate-y-0" : "-translate-y-full"}`
        }
      >
        <div className={"container mx-auto relative"}>
          <header className="px-2 md:px-4 lg:px-8 border-b">
            <div className="flex items-center justify-center">
              <HeaderLinks categories={categories} />

              <div className={"flex-1 flex justify-center items-center"}>
                <HeaderLogo />
              </div>

              <HeaderIcons />
            </div>
            <HeaderCategories categories={categories} />
          </header>
          <HeaderSearch />
        </div>
      </div>

      <div style={{ height: `${height}px` }}></div>
    </>
  );
}
