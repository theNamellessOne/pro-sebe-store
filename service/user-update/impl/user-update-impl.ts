"use server";

import { auth } from "@/auth/auth";
import prisma from "@/lib/prisma";
import {
  userChangePassword,
  UserChangePassword,
  usernameSchema,
  UserSave,
  UserUpdate,
  userUpdateFormSchema,
} from "@/schema/user/user-schema";
import { genSalt, hash } from "bcryptjs";

const ROUNDS = 8;

async function hashPassword(psw: string) {
  let salt = await genSalt(ROUNDS);
  return hash(psw, salt);
}

export async function _changePassword(input: UserChangePassword) {
  if (!userChangePassword.safeParse(input).success) {
    return {
      errMsg: "Некоректні дані",
      value: null,
    };
  }

  const session = await auth();
  if (!session) {
    return {
      errMsg: "Користувач не авторизований",
      value: null,
    };
  }

  const account = await prisma.account.findFirst({
    where: { userId: session.user.id },
  });
  if (account) {
    return {
      errMsg: "Invalid Operation",
      value: null,
    };
  }

  try {
    return {
      errMsg: null,
      value: await prisma.user.update({
        where: { id: session.user.id },
        data: { password: await hashPassword(input.password) },
      }),
    };
  } catch (err: any) {
    return { errMsg: "Щось пішло не так", value: null };
  }
}

export async function _updateCurrentUser(userData: UserUpdate) {
  if (!userUpdateFormSchema.safeParse(userData).success) {
    return {
      errMsg: "Некоректні дані",
      value: null,
    };
  }

  const session = await auth();

  if (!session) {
    return {
      errMsg: "Користувач не авторизований",
      value: null,
    };
  }

  try {
    return {
      errMsg: null,
      value: await prisma.user.update({
        where: { id: session.user.id },
        data: userData,
      }),
    };
  } catch (err: any) {
    return { errMsg: "шось пішло не так", value: null };
  }
}

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
        select: {
          name: true,
          email: true,
          surname: true,
          patronymic: true,
          phone: true,
          username: true,
        },
      }),
    };
  } catch {
    return { errMsg: "шось пішло не так", value: null };
  }
}
