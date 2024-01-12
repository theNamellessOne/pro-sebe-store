"use server";

import prisma from "@/lib/prisma";

export async function _fetchMisc() {
  return prisma.misc.findUnique({
    where: { id: 1 },
  });
}
