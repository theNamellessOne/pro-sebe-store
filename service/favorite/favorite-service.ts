import { _removeFromFavorites } from "./impl/favorite-delete-impl";
import {
  _getFavorites,
  _getFullFavorites,
} from "./impl/favorite-fetch-service";
import { _addToFavorites } from "./impl/favorite-write-service";

export class FavoriteService {
  public add = _addToFavorites;
  public getAll = _getFavorites;
  public remove = _removeFromFavorites;
  public getAllFull = _getFullFavorites;

  private static _instance: FavoriteService | undefined;

  static get instance() {
    if (!FavoriteService._instance) {
      FavoriteService._instance = new FavoriteService();
    }

    return FavoriteService._instance;
  }
}
