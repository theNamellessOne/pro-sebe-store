import {
  _fetchUserById,
  _fetchUsers,
} from "@/service/user/impl/user-fetch-service";
import { _setRole } from "@/service/user/impl/user-write-service";

export class UserService {
  public fetchById = _fetchUserById;
  public fetch = _fetchUsers;

  public setRole = _setRole;

  private static _instance: UserService | undefined;

  static get instance() {
    if (!UserService._instance) {
      UserService._instance = new UserService();
    }

    return UserService._instance;
  }
}
