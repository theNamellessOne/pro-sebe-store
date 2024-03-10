import { createContext, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { CategoryWithChildren } from "@/app/(client)/components/header/header-categories";
import { CategoryService } from "@/service/category/category-service";
import { useQuery } from "@tanstack/react-query";

export const CategoryTreeContext = createContext<
  CategoryTreeContext | undefined
>(undefined);

type CategoryTreeContext = {
  loading: boolean;
  categories: CategoryWithChildren[];
};

export function CategoryTreeProvider({ children }: { children: ReactNode }) {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.instance.fetchTree(),
  });

  return (
    <CategoryTreeContext.Provider
      value={{
        loading: query.isLoading,
        categories: query.data ?? [],
      }}
    >
      {children}
      <Toaster />
    </CategoryTreeContext.Provider>
  );
}
