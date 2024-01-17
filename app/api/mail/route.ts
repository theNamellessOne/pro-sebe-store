import { NextRequest } from "next/server";
import mailer from "nodemailer";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { TokenService } from "@/service/token/token-service";
import prisma from "@/lib/prisma";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

const sendEmail = (input: SendEmailInput) => {
  const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
      user: "asdfasdfadsf64@gmail.com",
      pass: "wxgr hguu itzr erfi",
    },
  });

  const mailOptions = {
    from: "asdfasdfadsf64@gmail.com",
    ...input,
  };

  transporter.sendMail(mailOptions, function (error: any, _: any) {
    if (error) {
      throw new Error(error);
    }
  });
};

async function handler(req: NextRequest) {
  const input = await req.json();
  const token = input.token;

  if (!token) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl));
  }

  const dbToken = await TokenService.instance.getSendEmailTokenByToken(token);
  if (!dbToken) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl));
  }

  await prisma.sendEmailToken.delete({ where: { token } });

  const hasExpired = new Date(dbToken.expires) < new Date();
  if (hasExpired) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl));
  }

  try {
    sendEmail(input);
    return Response.json({ msg: "confirmation email sent" });
  } catch (Exception) {
    return Response.json({ msg: "could not send email" });
  }
}

export const POST = handler;
