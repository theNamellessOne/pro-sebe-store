export class UTApiService {
  private static _instance: UTApiService | undefined;

  static get instance() {
    if (!UTApiService._instance) {
      UTApiService._instance = new UTApiService();
    }

    return UTApiService._instance;
  }
}
