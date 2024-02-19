"use client";

import { createRef, useEffect, useState } from "react";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@nextui-org/react";
import { Search } from "lucide-react";
import { headerEventChannel } from "./events/header-event-channel";

export function HeaderSearch() {
  const [showSearch, setShowSearch] = useState(false);
  const inputContainerRef = createRef<HTMLDivElement>();

  useOutsideClick(inputContainerRef, () => {
    setShowSearch(false);
  });

  useEffect(() => {
    const sk = headerEventChannel.on("onSeachIconPress", () => {
      setShowSearch(true);
    });
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
            endContent={<Search className={"w-6 h-6"} />}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
