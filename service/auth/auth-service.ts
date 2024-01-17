import {
  _login,
  _logout,
  _newPassword,
  _register,
  _resetPassword,
  _verify,
} from "@/service/auth/impl/auth-service-impl";

export class AuthService {
  public register = _register;

  public login = _login;
  public logout = _logout;
  public resetPassword = _resetPassword;
  public newPassword = _newPassword;

  public verify = _verify;

  private static _instance: AuthService | undefined;

  static get instance() {
    if (!AuthService._instance) {
      AuthService._instance = new AuthService();
    }

    return AuthService._instance;
  }
}
