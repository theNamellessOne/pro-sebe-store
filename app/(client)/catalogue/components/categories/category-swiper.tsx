import { CategoryWithChildren } from "@/app/(client)/components/header/header-categories";
import { useCategoryTree } from "@/app/(client)/hooks/use-category-tree";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export async function CategorySwiper({
  currentCategoryId,
}: {
  currentCategoryId: number;
}) {
  const { categories } = useCategoryTree()!;
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
    if (currentCategoryId === 0) {
      return setCurrent({
        children: categories,
      });
    }

    categories.forEach((category) => {
      const value = findInTree(category);

      if (!value) return;

      setCurrent(value);
    });
  }, [currentCategoryId]);

  if (!current) return null;

  return (
    <div
      className={"flex flex-nowrap container mx-auto overflow-x-auto gap-4 p-4"}
    >
      {current?.children.map((category) => (
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
