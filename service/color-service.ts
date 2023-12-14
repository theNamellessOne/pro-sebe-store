"use server";

import prisma from "@/lib/prisma";
import { ColorCreate, colorSchema } from "@/schema/color-schema";

export async function fetchAllColors() {
    return prisma.color.findMany();
}

export async function createColor(color: ColorCreate) {
    console.log(colorSchema.safeParse(color));
    return prisma.color.create({ data: color });
}
