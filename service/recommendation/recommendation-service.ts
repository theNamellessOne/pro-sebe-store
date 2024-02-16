import {
  _fetchSimilar,
  _precomputeTfIdf,
} from "./impl/recommedation-fetch-service";

export class RecommendationService {
  public fetchSimilar = _fetchSimilar;
  public precomputeTfIdf = _precomputeTfIdf;

  private static _instance: RecommendationService | undefined;

  static get instance() {
    if (!RecommendationService._instance) {
      RecommendationService._instance = new RecommendationService();
    }

    return RecommendationService._instance;
  }
}
