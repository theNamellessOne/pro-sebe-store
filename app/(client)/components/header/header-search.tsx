"use client";

import { createRef, useEffect, useState } from "react";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Input } from "@nextui-org/react";
import { Search } from "lucide-react";
import { headerEventChannel } from "./events/header-event-channel";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { filterEventChannel } from "../../catalogue/components/filters/events/filter-event-channgel";

export function HeaderSearch() {
  const [showSearch, setShowSearch] = useState(false);
  const [value, setValue] = useState("");
  const inputContainerRef = createRef<HTMLDivElement>();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch() {
    const params = new URLSearchParams();
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    setShowSearch(false);
    filterEventChannel.emit("onSearchChange");
    replace(`/catalogue?${params.toString()}`);
  }

  function readSearch() {
    return searchParams.get("query") || "";
  }

  useOutsideClick(inputContainerRef, () => {
    setShowSearch(false);
  });

  useEffect(() => {
    const iconPressUnsub = headerEventChannel.on("onSeachIconPress", () => {
      setShowSearch(true);
    });

    const headerHideUnsub = headerEventChannel.on("onHeaderHide", () => {
      setShowSearch(false);
    });

    return () => {
      iconPressUnsub();
      headerHideUnsub();
    };
  }, []);

  return (
    <AnimatePresence>
      {showSearch && (
        <motion.div
          ref={inputContainerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="z-50 bg-white absolute inset-0 mt-2 px-4 h-[80px]"
        >
          <Input
            autoFocus
            label="Пошук"
            variant="underlined"
            value={value}
            placeholder={readSearch()}
            onValueChange={setValue}
            endContent={
              <Button
                isIconOnly
                onPress={handleSearch}
                variant={"light"}
                color={"primary"}
                className={"rounded-sm"}
              >
                <Search className={"w-6 h-6"} />
              </Button>
            }
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
