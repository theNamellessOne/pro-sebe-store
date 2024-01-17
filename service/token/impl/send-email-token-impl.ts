"use server";

import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function _generateSendEmailToken() {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  return prisma.sendEmailToken.create({
    data: {
      token,
      expires,
    },
  });
}

export async function _getSendEmailTokenByToken(token: string) {
  try {
    return prisma.sendEmailToken.findUnique({
      where: { token },
    });
  } catch (e) {
    return null;
  }
}
