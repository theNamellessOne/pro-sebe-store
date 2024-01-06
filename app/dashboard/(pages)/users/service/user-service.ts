import {
  _fetchAllUsers,
  _fetchUserById,
  _fetchUsers,
} from "@/app/dashboard/(pages)/users/service/impl/user-fetch-service";
import { _setRole } from "@/app/dashboard/(pages)/users/service/impl/user-write-service";

export class UserService {
  public fetchAll = _fetchAllUsers;
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
