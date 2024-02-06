"use server";

import prisma from "@/lib/prisma";

export async function _deleteManyInIds(ids: number[]) {
  await prisma.review.deleteMany({
    where: {
      id: { in: ids },
    },
  });
}

export async function _deleteReview(id: number) {
  await prisma.review.delete({ where: { id } });
}

export async function _deleteManyReviews(query: string) {
  await prisma.review.deleteMany({
    where: {
      content: {
        contains: query,
      },
    },
  });
}
