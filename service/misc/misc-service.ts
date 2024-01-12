import { _fetchMisc } from "./impl/misc-fetch-service";
import { _saveMisc } from "./impl/misc-write-service";

export class MiscService {
  public fetch = _fetchMisc;

  public save = _saveMisc;

  private static _instance: MiscService | undefined;

  static get instance() {
    if (!MiscService._instance) {
      MiscService._instance = new MiscService();
    }

    return MiscService._instance;
  }
}
