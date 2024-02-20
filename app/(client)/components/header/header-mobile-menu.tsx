"use client";

import { Accordion, AccordionItem, Button, Divider } from "@nextui-org/react";
import { CiFacebook } from "react-icons/ci";
import { CgClose } from "react-icons/cg";
import { FaFacebookF } from "react-icons/fa";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Cross, Facebook, Menu, PhoneIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CgInstagram } from "react-icons/cg";
import { LiaFacebookSquare, LiaTelegram } from "react-icons/lia";
import { CategoryWithChildren } from "./header-categories";
import { HeaderLink } from "./header-links";
import { HeaderLogo } from "./header-logo";

export const HeaderMobileMenu = ({
  categories,
}: {
  categories: CategoryWithChildren[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <LayoutGroup>
      <AnimatePresence mode={"wait"}>
        {!open && (
          <motion.div layout>
            <Button
              isIconOnly
              color={"primary"}
              variant={"light"}
              className={"lg:hidden m-1"}
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
            className={
              "inset-0 z-40 fixed h-[150vh] w-screen backdrop-blur bg-black/20"
            }
          ></motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode={"wait"}>
        {open && (
          <motion.div
            layout
            className={
              "min-w-[300px] w-1/2 z-50 h-screen bg-background flex flex-col " +
              "overflow-y-scroll fixed top-0 bottom-0 left-0 text-primary"
            }
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ ease: "easeOut" }}
          >
            <div className="w-full p-0">
              <div className={"w-full py-4 px-2 relative"}>
                <HeaderLogo />
                <Button
                  isIconOnly
                  variant={"light"}
                  color={"primary"}
                  className={"rounded-sm absolute top-4 right-0"}
                  onPress={() => setOpen(false)}
                >
                  <CgClose className={"w-6 h-6 text-primary"} />
                </Button>
              </div>

              <div className={"flex flex-col pl-2"}>
                <HeaderLink
                  text={"Каталог"}
                  href={"/catalogue"}
                  className={"py-4"}
                  onClick={() => {
                    setOpen(false);
                  }}
                />
                <Divider />
                <HeaderLink
                  text={"Вiдгуки"}
                  href={"/catalogue"}
                  className={"py-4"}
                  onClick={() => {
                    setOpen(false);
                  }}
                />
                <Divider />
                <HeaderLink
                  text={"Про нас"}
                  href={"/catalogue"}
                  className={"py-4"}
                  onClick={() => {
                    setOpen(false);
                  }}
                />
                <Divider />
              </div>

              <Accordion>
                {categories.map((category) => {
                  return (
                    <AccordionItem
                      classNames={{ title: "uppercase text-md" }}
                      key={category.id}
                      aria-label={category.name}
                      title={
                        <Link
                          href={`/catalogue?categoryFilter=[${category.id}]`}
                          onClick={() => {
                            setOpen(false);
                          }}
                        >
                          {category.name}
                        </Link>
                      }
                    >
                      <Accordion className={"-mt-4"}>
                        {category.children.map((category) => {
                          return (
                            <AccordionItem
                              classNames={{ title: "uppercase text-md" }}
                              key={category.id}
                              aria-label={category.name}
                              title={
                                <Link
                                  href={`/catalogue?categoryFilter=[${category.id}]`}
                                  onClick={() => {
                                    setOpen(false);
                                  }}
                                >
                                  {category.name}
                                </Link>
                              }
                            >
                              <div className={"-mt-1 flex flex-col gap-4 pl-4"}>
                                {category.children.map((category) => {
                                  return (
                                    <Link
                                      href={`/catalogue?categoryFilter=[${category.id}]`}
                                      onClick={() => {
                                        setOpen(false);
                                      }}
                                      key={category.id}
                                    >
                                      {category.name}
                                    </Link>
                                  );
                                })}
                              </div>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>

            <div className={"flex gap-4 p-2 mt-auto"}>
              <a
                href="https://www.instagram.com/pro.sebe.store/"
                target="_blank"
              >
                <CgInstagram className={"w-6 h-6 text-primary"} />
              </a>
              <a href="https://t.me/pro_sebe_store" target="_blank">
                <LiaTelegram className={"w-6 h-6 text-primary"} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                className={"scale-125"}
              >
                <LiaFacebookSquare className={"w-6 h-6 text-primary"} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
};
