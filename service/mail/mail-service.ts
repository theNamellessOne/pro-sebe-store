import { _sendPasswordResetEmail } from "@/service/mail/impl/send-password-reset-email";
import { _sendVerificationEmail } from "@/service/mail/impl/send-verification-email";
import { _sendTwoFactorTokenEmail } from "@/service/mail/impl/send-two-factor-email";
import { _sendInvoiceEmail } from "@/service/mail/impl/send-invoice-email";

export class MailService {
  public sendPasswordResetEmail = _sendPasswordResetEmail;
  public sendVerificationMail = _sendVerificationEmail;
  public sendTwoFactorMail = _sendTwoFactorTokenEmail;
  public sendInvoiceMail = _sendInvoiceEmail;

  private static _instance: MailService | undefined;

  static get instance() {
    if (!MailService._instance) {
      MailService._instance = new MailService();
    }

    return MailService._instance;
  }
}
