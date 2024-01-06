"use server";

import {
  SizeSave,
  sizeSchema,
} from "@/app/dashboard/(pages)/sizes/schema/size-schema";
import prisma from "@/lib/prisma";

export async function _saveSize(size: SizeSave) {
  return size.id ? _updateSize(size) : _createSize(size);
}

async function _createSize(size: SizeSave) {
  if (!sizeSchema.safeParse(size)) {
    return {
      errMsg: "invalid data",
      value: null,
    };
  }

  return {
    errMsg: null,
    value: await prisma.size.create({ data: size }),
  };
}

async function _updateSize(size: SizeSave) {
  if (!sizeSchema.safeParse(size)) {
    return {
      errMsg: "invalid data",
      value: null,
    };
  }

  const id = size.id;
  return {
    errMsg: null,
    value: await prisma.size.update({
      where: { id },
      data: {
        ...size,
        id: undefined,
      },
    }),
  };
}
