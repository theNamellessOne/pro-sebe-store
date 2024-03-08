"use client";

import { Menu } from "lucide-react";

import { useState } from "react";
import { Button } from "@nextui-org/button";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {UserPageSidebar} from "@/app/(client)/user-page/components/sidebar/user-page-sidebar";

export const UserPageSidebarMobile = () => {
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
                            className={"md:hidden m-1 w-full"}
                            onClick={() => {
                                setOpen(true);
                            }}
                        >
                             Menu
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode={"wait"}>
                {open && (
                    <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className={"inset-0 fixed z-40"}
                    ></motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode={"wait"}>
                {open && (
                    <motion.div
                        layout
                        className={"z-50 w-full flex fixed"}
                        initial={{ y: 10 }}
                        animate={{ y: 0}}
                        exit={{ y: 10}}
                        transition={{ ease: "easeOut" }}
                    >
                        <div className="h-full w-full shadow-small pl-4 bg-background">
                            <UserPageSidebar />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </LayoutGroup>
    );
};
