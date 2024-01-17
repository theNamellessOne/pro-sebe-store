"use server";

import { _sendEmail } from "@/service/mail/impl/send-email";

const domain = process.env.BASE_URL;

export async function _sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  return _sendEmail({
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  });
}
