"use client";

import { LogOut, Menu } from "lucide-react";

import { Sidebar, dashboardMenuItems } from "./sidebar";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ClientProtectedComponent } from "@/app/components/protected-component";
import { SidebarItem } from "./sidebar-item";
import { AuthService } from "@/service/auth/auth-service";
import {HeaderLogo} from "@/app/(client)/components/header/header-logo";

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
            className={"z-50 h-full flex fixed top-0"}
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ ease: "easeOut" }}
          >
            <div className="h-full shadow-small rounded-r-large w-[250px] p-0 bg-background">
              <aside
                className={
                  "flex flex-col h-full top-0 overflow-y-auto fixed py-6 w-[250px] border-r border-r-secondary border-r-0.5"
                }
              >
                <HeaderLogo/>

                {dashboardMenuItems.map((item, idx) => {
                  return (
                    <ClientProtectedComponent
                      key={idx}
                      minimumRequiredRole={item.role}
                    >
                      <span onClick={() => setOpen(false)}>
                        <SidebarItem {...item} />
                      </span>
                    </ClientProtectedComponent>
                  );
                })}

                <div className={"bottom-0 w-full mt-auto ml-2"}>
                  <Button
                    color={"danger"}
                    variant={"light"}
                    onClick={() => {
                      AuthService.instance.logout();
                    }}
                  >
                    <LogOut /> Logout
                  </Button>
                </div>
              </aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
};
