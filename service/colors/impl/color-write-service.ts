"use server";

import { ColorSave, colorSchema } from "@/schema/colors/color-schema";
import prisma from "@/lib/prisma";

export async function _saveColor(color: ColorSave) {
  return color.id ? _updateColor(color) : _createColor(color);
}

async function _createColor(color: ColorSave) {
  if (!colorSchema.safeParse(color)) {
    return {
      errMsg: "Некоректні дані!",
      value: null,
    };
  }

  return {
    errMsg: null,
    value: await prisma.color.create({ data: color }),
  };
}

async function _updateColor(color: ColorSave) {
  if (!colorSchema.safeParse(color)) {
    return {
      errMsg: "Некоректні дані!",
      value: null,
    };
  }

  const id = color.id;

  return {
    errMsg: null,
    value: await prisma.color.update({
      where: { id },
      data: {
        ...color,
        id: undefined,
      },
    }),
  };
}
