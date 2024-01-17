"use server";

import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";

export async function _generatePasswordResetToken(email: string) {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await prisma.passwordResetToken.findFirst({
    where: {
      email,
    },
  });

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  return prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
}

export async function _getPasswordResetTokenByToken(token: string) {
  try {
    return prisma.passwordResetToken.findUnique({
      where: { token },
    });
  } catch (e) {
    return null;
  }
}
