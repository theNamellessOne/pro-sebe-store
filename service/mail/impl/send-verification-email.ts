"use server";

import { _sendEmail } from "@/service/mail/impl/send-email";

const domain = process.env.BASE_URL;

export async function _sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${domain}/auth/verification?token=${token}`;

  return _sendEmail({
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
}
