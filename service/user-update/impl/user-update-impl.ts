"use server";

import { auth } from "@/auth/auth";
import prisma from "@/lib/prisma";
import { usernameSchema } from "@/schema/user/user-schema";

export async function _updateUsername(username: string) {
  if (!usernameSchema.safeParse(username).success) {
    return { errMsg: "не валідний юзернейм", value: null };
  }

  const usernameExists = await prisma.user.findUnique({
    where: { username },
  });

  if (usernameExists) {
    return { errMsg: "користувач з таким юзернеймом вже існує", value: null };
  }

  const session = await auth();

  if (!session) {
    return { errMsg: "не авторизовано", value: null };
  }

  try {
    return {
      errMsg: null,
      value: await prisma.user.update({
        where: { id: session.user.id },
        data: { username },
      }),
    };
  } catch {
    return { errMsg: "шось пішло не так", value: null };
  }
}
