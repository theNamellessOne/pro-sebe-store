"use server";

import { _sendEmail } from "@/service/mail/impl/send-email";

export async function _sendTwoFactorTokenEmail(email: string, token: string) {
  return _sendEmail({
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
}
