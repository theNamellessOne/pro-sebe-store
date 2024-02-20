import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CategoryService } from "@/service/category/category-service";
import { Category } from "@prisma/client";

export type SelectedCategory = Category & { isSelected: boolean };

export function useCategoryFilter() {
  const [categories, setCategories] = useState<SelectedCategory[]>([]);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const setFilter = (categoryIds: number[]) => {
    const params = new URLSearchParams(searchParams);
    if (categoryIds) {
      params.set("categoryFilter", JSON.stringify(categoryIds));
    } else {
      params.delete("categoryFilter");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const readFilter = () => {
    const categoryFilterParam = searchParams.get("categoryFilter");
    if (!categoryFilterParam) {
      return "all";
    }

    return JSON.parse(categoryFilterParam) as number[];
  };

  useEffect(() => {
    CategoryService.instance.fetchAll().then((res) => {
      const selectedIds = readFilter();
      if (selectedIds === "all") {
        setCategories(
          res.map((item) => {
            return { isSelected: true, ...item };
          }),
        );
        return;
      }

      setCategories(
        res.map((item) => {
          return {
            isSelected: selectedIds.includes(item.id),
            ...item,
          };
        }),
      );
    });
  }, []);

  const toggleSelection = (idx: number) => {
    categories[idx].isSelected = !categories[idx].isSelected;
    setCategories([...categories]);
  };

  const filterCategories = () => {
    const filteredCategorys = categories
      .filter((item) => item.isSelected)
      .map((item) => item.id);
    setFilter(filteredCategorys);
  };

  return { setFilter };
}
