"use client";

import { CategoryWithChildren } from "@/app/(client)/components/header/header-categories";
import { useCategoryTree } from "@/app/(client)/hooks/use-category-tree";
import { Skeleton } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export async function CategorySwiper({
  currentCategoryId,
}: {
  currentCategoryId: number;
}) {
  const { categories, loading } = useCategoryTree()!;
  const [current, setCurrent] = useState<{
    children: CategoryWithChildren[];
  } | null>(null);

  const findInTree = (node: CategoryWithChildren) => {
    if (!node) return null;
    if (node.id === currentCategoryId) return node;

    node.children.forEach((child) => {
      const value = findInTree(child);
      if (value) return value;
    });
  };

  useEffect(() => {
    if (currentCategoryId === 0 || !currentCategoryId) {
      return setCurrent({
        children: categories,
      });
    }

    categories.forEach((category) => {
      const value = findInTree(category);

      if (!value) return;

      return setCurrent(value);
    });
  }, [currentCategoryId, loading]);

  if (!current) return null;

  return (
    <div
      className={"flex flex-nowrap container mx-auto overflow-x-auto gap-4 p-4"}
    >
      {loading && (
        <>
          {[1, 2, 3, 4].map((i) => (
            <>
              <Skeleton
                key={"category_loader_" + i}
                className={"w-[80px] h-[80px] rounded-full"}
              ></Skeleton>
              <Skeleton>
                <p>any</p>
              </Skeleton>
            </>
          ))}
        </>
      )}

      {!loading &&
        current?.children.map((category) => (
          <Link
            key={category.id}
            href={`/catalogue?categoryFilter=[${category.id}]`}
            className={
              "group shrink-0 w-fit flex flex-col items-center justify-center gap-1"
            }
          >
            <div
              className={
                "rounded-full border-2 border-secondary p-1 overflow-hidden " +
                "group-hover:border-primary/80 transition-colors"
              }
            >
              <Image
                className={
                  "h-[80px] w-[80px] object-cover rounded-full group-hover:text-primary/80"
                }
                src={
                  category.imageUrl
                    ? category.imageUrl
                    : "https://utfs.io/f/9f49f263-2475-45a1-8770-479fd5cb0c80-9w6i5v.png"
                }
                alt={""}
                height={"100"}
                width={"100"}
              />
            </div>
            <p>{category.name}</p>
          </Link>
        ))}
    </div>
  );
}
