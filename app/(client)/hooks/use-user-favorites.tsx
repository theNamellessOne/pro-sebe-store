import { useContext } from "react";
import { UserFavoritesContext } from "../providers/user-favorites-provider";

export function useUserFavorites() {
  return useContext(UserFavoritesContext);
}
