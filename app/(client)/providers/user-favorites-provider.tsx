import { createContext, ReactNode, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FavoriteService } from "@/service/favorite/favorite-service";

export const UserFavoritesContext = createContext<
  UserFavoritesContext | undefined
>(undefined);

type UserFavoritesContext = {
  loading: boolean;
  productArticles: string[];
  isFavorite: (productArticle: string) => boolean;
  add: (productArticle: string) => void;
  remove: (productArticle: string) => void;
};

export function UserFavoritesProvider({ children }: { children: ReactNode }) {
  const query = useQuery({
    queryKey: ["favorites"],
    queryFn: () => FavoriteService.instance.getAll(),
  });
  const queryClient = useQueryClient();

  const isFavorite = (productArticle: string) => {
    if (!query.data?.value) return false;

    return !!query.data.value.find((item) => item === productArticle);
  };

  const add = useMutation({
    mutationFn: (productArticle: string) =>
      FavoriteService.instance.add(productArticle),

    onMutate: async (productArticle: string) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });

      const prev = queryClient.getQueryData<{ value: string[] }>(["favorites"]);

      if (prev) {
        queryClient.setQueryData(["favorites"], {
          value: [...prev.value, productArticle],
        });
      }

      return { prev };
    },

    onSettled: (data) => {
      if (data?.errMsg) {
        toast.error("Не вдалось додати до обраного");
      }

      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const remove = useMutation({
    mutationFn: (productArticle: string) =>
      FavoriteService.instance.remove(productArticle),

    onMutate: async (productArticle: string) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });

      const prev = queryClient.getQueryData<{ value: string[] }>(["favorites"]);

      if (prev) {
        queryClient.setQueryData(["favorites"], {
          value: prev.value.filter((item) => item !== productArticle),
        });
      }

      return { prev };
    },

    onSettled: (data) => {
      if (data?.errMsg) {
        toast.error("Не вдалось видалити з обраного");
      }

      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return (
    <UserFavoritesContext.Provider
      value={{
        loading: query.isLoading,
        productArticles: query.data?.value ?? [],
        isFavorite: isFavorite,
        add: add.mutate,
        remove: remove.mutate,
      }}
    >
      {children}
      <Toaster />
    </UserFavoritesContext.Provider>
  );
}
