import {
  _fetchAllColors,
  _fetchColorById,
  _fetchColors,
} from "@/app/dashboard/(pages)/colors/service/impl/color-fetch-service";
import { _saveColor } from "@/app/dashboard/(pages)/colors/service/impl/color-write-service";

export class ColorService {
  public fetchAll = _fetchAllColors;
  public fetchById = _fetchColorById;
  public fetch = _fetchColors;

  public save = _saveColor;

  private static _instance: ColorService | undefined;

  static get instance() {
    if (!ColorService._instance) {
      ColorService._instance = new ColorService();
    }

    return ColorService._instance;
  }
}
