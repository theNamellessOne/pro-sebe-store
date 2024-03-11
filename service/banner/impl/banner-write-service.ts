"use server";

import { BannerSave, bannerSchema } from "@/schema/banner/banner-schema";
import prisma from "@/lib/prisma";

export async function _saveBanner(banner: BannerSave) {
  return banner.id ? _updateBanner(banner) : _createBanner(banner);
}

async function _createBanner(banner: BannerSave) {
  if (!bannerSchema.safeParse(banner)) {
    return {
      errMsg: "Некоректні дані!",
      value: null,
    };
  }

  return {
    errMsg: null,
    value: await prisma.banner.create({ data: banner }),
  };
}

async function _updateBanner(banner: BannerSave) {
  if (!bannerSchema.safeParse(banner)) {
    return {
      errMsg: "Некоректні дані!",
      value: null,
    };
  }

  const id = banner.id;

  return {
    errMsg: null,
    value: await prisma.banner.update({
      where: { id },
      data: {
        ...banner,
        id: undefined,
      },
    }),
  };
}
