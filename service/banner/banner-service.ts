import {
  _fetchAllBanners,
  _fetchBannerById,
  _fetchBanners,
} from "@/service/banner/impl/banner-fetch-service";
import { _saveBanner } from "@/service/banner/impl/banner-write-service";

export class BannerService {
  public fetchAll = _fetchAllBanners;
  public fetchById = _fetchBannerById;
  public fetch = _fetchBanners;

  public save = _saveBanner;

  private static _instance: BannerService | undefined;

  static get instance() {
    if (!BannerService._instance) {
      BannerService._instance = new BannerService();
    }

    return BannerService._instance;
  }
}
