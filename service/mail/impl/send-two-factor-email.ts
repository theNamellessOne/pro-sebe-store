"use server";

import { _sendEmail } from "@/service/mail/impl/send-email";

export async function _sendTwoFactorTokenEmail(email: string, token: string) {
  return _sendEmail({
    to: email,
    subject: "Код підтвердження",
    html: `<p>Ваш код підтвердження: ${token}</p>`,
  });
}
