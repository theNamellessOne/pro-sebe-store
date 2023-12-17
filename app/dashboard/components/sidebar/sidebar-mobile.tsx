"use client";

import { Menu } from "lucide-react";

import { Sidebar } from "./sidebar";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

export const SidebarMobile = () => {
  const [open, setOpen] = useState(false);

  return (
    <LayoutGroup>
      <AnimatePresence mode={"wait"}>
        {!open && (
          <motion.div layout>
            <Button
              isIconOnly
              color={"primary"}
              variant={"ghost"}
              className={"md:hidden m-1"}
              onClick={() => {
                setOpen(true);
              }}
            >
              <Menu />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode={"wait"}>
        {open && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className={"inset-0 z-40 fixed grow backdrop-blur bg-black/20"}
          ></motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode={"wait"}>
        {open && (
          <motion.div
            layout
            className={"z-50 h-full flex fixed"}
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ ease: "easeOut" }}
          >
            <div className="h-full shadow-small rounded-r-large w-[250px] p-0 bg-white">
              <Sidebar />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
};
