import {
  _fetchSimilar,
} from "./impl/recommedation-fetch-service";

export class RecommendationService {
  public fetchSimilar = _fetchSimilar;

  private static _instance: RecommendationService | undefined;

  static get instance() {
    if (!RecommendationService._instance) {
      RecommendationService._instance = new RecommendationService();
    }

    return RecommendationService._instance;
  }
}
