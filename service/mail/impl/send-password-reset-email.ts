"use server";

import { _sendEmail } from "@/service/mail/impl/send-email";

const domain = process.env.BASE_URL;

export async function _sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  return _sendEmail({
    to: email,
    subject: "Скинути пароль",
    html: `<p>Натисніть <a href="${resetLink}">тут</a> щоб скинути пароль.</p>`,
  });
}
