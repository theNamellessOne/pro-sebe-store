import { _updateUsername } from "@/service/user-update/impl/user-update-impl";

export class UserUpdateService {
  public setUsername = _updateUsername;

  private static _instance: UserUpdateService | undefined;

  static get instance() {
    if (!UserUpdateService._instance) {
      UserUpdateService._instance = new UserUpdateService();
    }

    return UserUpdateService._instance;
  }
}
