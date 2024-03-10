import Loading from "@/app/loading";
import { createContext, ReactNode, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { CategoryWithChildren } from "@/app/(client)/components/header/header-categories";
import { CategoryService } from "@/service/category/category-service";

export const CategoryTreeContext = createContext<
  CategoryTreeContext | undefined
>(undefined);

type CategoryTreeContext = {
  categories: CategoryWithChildren[];
};

export function CategoryTreeProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);

  useEffect(() => {
    setIsLoading(true);
    CategoryService.instance
      .fetchTree()
      .then(setCategories)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <CategoryTreeContext.Provider
      value={{
        categories,
      }}
    >
      {isLoading && <Loading />}
      {children}
      <Toaster />
    </CategoryTreeContext.Provider>
  );
}
