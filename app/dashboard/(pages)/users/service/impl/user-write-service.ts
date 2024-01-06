"use server";

import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function _setRole(userId: string, role: Role) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      role,
    },
  });
}
