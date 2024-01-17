"use server";

import { TokenService } from "@/service/token/token-service";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

const domain = process.env.BASE_URL;

export async function _sendEmail(input: SendEmailInput) {
  const token = await TokenService.instance.generateSendEmailToken();

  const res = await fetch(`${domain}/api/mail`, {
    method: "POST",
    body: JSON.stringify({ ...input, token: token.token }),
  });

  return (await res.json()).msg;
}
