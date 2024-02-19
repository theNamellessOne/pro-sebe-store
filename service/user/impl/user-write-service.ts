"use server";

import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { UserSave, userSchema } from "@/schema/user/user-schema";
import { auth } from "@/auth/auth";

export async function _saveUser(user: UserSave) {
  return user.id ? _updateUser(user) : _createUser(user);
}

async function _createUser(user: UserSave) {
  if (!userSchema.safeParse(user)) {
    return {
      errMsg: "invalid data",
      value: null,
    };
  }

  return {
    errMsg: null,
    value: await prisma.user.create({ data: user }),
  };
}

async function _updateUser(user: UserSave) {
  if (!userSchema.safeParse(user)) {
    return {
      errMsg: "invalid data",
      value: null,
    };
  }

  const id = user.id;

  return {
    errMsg: null,
    value: await prisma.user.update({
      where: { id },
      data: {
        ...user,
        id: undefined,
      },
    }),
  };
}

export async function _setRole(userId: string, role: Role) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      role,
    },
  });
}
