"use server";

import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function _generateVerificationToken(email: string) {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await _getVerificationTokenByEmail(email);
  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  return prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
}

export async function _getVerificationTokenByToken(token: string) {
  try {
    return prisma.verificationToken.findUnique({
      where: { token },
    });
  } catch {
    return null;
  }
}

export async function _getVerificationTokenByEmail(email: string) {
  try {
    return prisma.verificationToken.findFirst({
      where: { email },
    });
  } catch {
    return null;
  }
}
