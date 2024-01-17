import {
  _generateVerificationToken,
  _getVerificationTokenByEmail,
  _getVerificationTokenByToken,
} from "@/service/token/impl/verification-token-impl";
import {
  _generatePasswordResetToken,
  _getPasswordResetTokenByToken,
} from "@/service/token/impl/password-reset-token-impl";
import {
  _generateTwoFactorToken,
  _getTwoFactorConfirmationByUserId,
  _getTwoFactorTokenByEmail,
} from "@/service/token/impl/two-factor-token-impl";
import {
  _generateSendEmailToken,
  _getSendEmailTokenByToken,
} from "@/service/token/impl/send-email-token-impl";

export class TokenService {
  public generateSendEmailToken = _generateSendEmailToken;
  public getSendEmailTokenByToken = _getSendEmailTokenByToken;

  public generatePasswordResetToken = _generatePasswordResetToken;
  public getPasswordResetTokenByToken = _getPasswordResetTokenByToken;

  public generateVerificationToken = _generateVerificationToken;
  public getVerificationTokenByToken = _getVerificationTokenByToken;
  public getVerificationTokenByEmail = _getVerificationTokenByEmail;

  public generateTwoFactorToken = _generateTwoFactorToken;
  public getTwoFactorTokenByEmail = _getTwoFactorTokenByEmail;
  public getTwoFactorConfirmationByUserId = _getTwoFactorConfirmationByUserId;

  private static _instance: TokenService | undefined;

  static get instance() {
    if (!TokenService._instance) {
      TokenService._instance = new TokenService();
    }

    return TokenService._instance;
  }
}
