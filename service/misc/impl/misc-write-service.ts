"use server";

import prisma from "@/lib/prisma";
import { MiscSave, miscSchema } from "@/schema/misc/misc-schema";

export async function _saveMisc(misc: MiscSave) {
  if (!miscSchema.safeParse(misc)) {
    return {
      errMsg: "Некоректні дані!",
      value: null,
    };
  }

  const id = 1;

  return {
    errMsg: null,
    value: await prisma.misc.upsert({
      where: { id },
      create: {
        ...misc,
      },
      update: {
        ...misc,
      },
    }),
  };
}
