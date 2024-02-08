import {
  _calculateApproximateDeliverycost,
  _fetchWarehouseByCityRef,
  _searchSettlement,
} from "./novapost-fetch-service";

export class NovaPostService {
  public fetchWarehouseByCityRef = _fetchWarehouseByCityRef;
  public searchSettlement = _searchSettlement;
  public approximateCost = _calculateApproximateDeliverycost;

  private static _instance: NovaPostService | undefined;

  static get instance() {
    if (!NovaPostService._instance) {
      NovaPostService._instance = new NovaPostService();
    }

    return NovaPostService._instance;
  }
}
