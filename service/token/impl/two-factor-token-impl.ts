"use server";

import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function _generateTwoFactorToken(email: string) {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await prisma.twoFactorToken.findFirst({
    where: {
      email,
    },
  });

  if (existingToken) {
    await prisma.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  return prisma.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
}

export async function _getTwoFactorTokenByEmail(email: string) {
  try {
    return await prisma.twoFactorToken.findFirst({
      where: { email },
    });
  } catch (Exception) {
    return null;
  }
}

export async function _getTwoFactorConfirmationByUserId(userId: string) {
  try {
    return await prisma.twoFactorConfirmation.findUnique({
      where: { userId },
    });
  } catch {
    return null;
  }
}
