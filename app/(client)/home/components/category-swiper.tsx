import { CategoryService } from "@/service/category/category-service";
import Image from "next/image";
import Link from "next/link";

export async function CategorySwiper() {
  const categories = await CategoryService.instance.fetchAll();

  return (
    <div
      className={"flex flex-nowrap container mx-auto overflow-x-auto gap-4 p-4"}
    >
      {categories.map((category) => (
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
