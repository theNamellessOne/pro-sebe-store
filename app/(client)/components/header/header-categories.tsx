"use client";

import { Category } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export type CategoryWithChildren = Category & {
  children: CategoryWithChildren[];
};

export function HeaderCategories({
  categories,
}: {
  categories: CategoryWithChildren[];
}) {
  const [selected, setSelected] = useState<CategoryWithChildren | undefined>();

  return (
    <div
      onMouseLeave={() => setSelected(undefined)}
      className={
        "hidden lg:flex flex-col justify-center items-center py-4 relative text-primary"
      }
    >
      <div className={"flex gap-4"}>
        {categories.map((category) => {
          return (
            <div className={"uppercase relative"} key={category.id}>
              <Link
                href={`/catalogue?categoryFilter=[${category.id}]`}
                onMouseOver={() => setSelected(category)}
              >
                {category.name}
              </Link>

              <AnimatePresence>
                {selected?.id === category.id && (
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    exit={{ width: 0 }}
                    className={
                      "absolute bg-primary -bottom-1 left-0 h-px w-full"
                    }
                  ></motion.span>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && selected.children.length > 0 && (
          <motion.div
            layout
            className={
              "absolute z-50 w-screen mt-12 bg-white top-0 " +
              "flex justify-center gap-24 py-8 shadow-xl"
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {selected.children.map((child) => {
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={"capitalize flex flex-col gap-4"}
                  key={child.id}
                >
                  <Link
                    href={`/catalogue?categoryFilter=[${child.id}]`}
                    className="uppercase group relative w-fit"
                  >
                    {child.name}
                    <span
                      className={
                        "absolute bg-primary -bottom-1 left-0 h-px w-0 group-hover:w-full transition-size"
                      }
                    ></span>
                  </Link>
                  {child.children.map((child1) => {
                    return (
                      <Link
                        href={`/catalogue?categoryFilter=[${child1.id}]`}
                        className="uppercase group relative w-fit text-primary/80"
                        key={child1.id}
                      >
                        {child1.name}
                        <span
                          className={
                            "absolute bg-primary -bottom-1 left-0 h-px w-0 group-hover:w-full transition-size"
                          }
                        ></span>
                      </Link>
                    );
                  })}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
