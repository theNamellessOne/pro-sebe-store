import { NextRequest } from "next/server";
import mailer from "nodemailer";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { TokenService } from "@/service/token/token-service";
import prisma from "@/lib/prisma";
import {Ratelimit} from "@upstash/ratelimit";
import {redis} from "@/middleware";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

const mailRateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(1, "300 s"),
});

const sendEmail = async (input: SendEmailInput) => {
  const transporter = mailer.createTransport({
    port: 465,
    service: "gmail",
    auth: {
      user: "asdfasdfadsf64@gmail.com",
      pass: "wxgr hguu itzr erfi",
    },
  });

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        reject(error);
      } else {
        resolve(success);
      }
    });
  });

  const mailOptions = {
    from: "asdfasdfadsf64@gmail.com",
    ...input,
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};

async function handler(req: NextRequest) {
  const input = await req.json();
  const token = input.token;
  const ip = req.ip ?? '127.0.0.1';

  const { success, pending, limit, reset, remaining } = await mailRateLimiter.limit(
      ip
  );
  if (!success) return Response.json({error: "Перевищено кількість запитів на відправку емейлів (раз в 300сек). Спробуйте пізніше"})

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
    await sendEmail(input);
    return Response.json({ success: "Лист із підтвердженням надіслано!" });
  } catch (Exception) {
    return Response.json({ error: "Не вдалося надіслати листa!" });
  }
}

export const POST = handler;
