import {
  _fetchAllSizes,
  _fetchSizeById,
  _fetchSizes,
} from "@/app/dashboard/(pages)/sizes/service/impl/size-fetch-service";
import { _saveSize } from "@/app/dashboard/(pages)/sizes/service/impl/size-write-service";

export class SizeService {
  public fetchAll = _fetchAllSizes;
  public fetchById = _fetchSizeById;
  public fetch = _fetchSizes;

  public save = _saveSize;

  private static _instance: SizeService | undefined;

  static get instance() {
    if (!SizeService._instance) {
      SizeService._instance = new SizeService();
    }

    return SizeService._instance;
  }
}
