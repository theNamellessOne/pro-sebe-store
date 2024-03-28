"use server";

import { TokenService } from "@/service/token/token-service";
import { headers } from "next/headers";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

const domain = process.env.BASE_URL;

export async function _sendEmail(input: SendEmailInput) {
  const token = await TokenService.instance.generateSendEmailToken();

  const headersList = headers();
  const cookie = headersList.get("cookie");

  const res = await fetch(`${domain}/api/mail`, {
    method: "POST",
    body: JSON.stringify({ ...input, token: token.token }),
    //@ts-ignore
    headers: {
      Cookie: cookie,
    },
  });

  return await res.json();
}
