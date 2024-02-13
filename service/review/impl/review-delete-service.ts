"use server";

import prisma from "@/lib/prisma";

export async function _deleteManyInIds(ids: number[]) {
  await prisma.review.deleteMany({
    where: {
      id: { in: ids },
    },
  });
}

function _getWhere(query: string | undefined) {
  let search: { search: string } | undefined;
  if (query && query.length > 0) search = { search: `${query}*` };

  return { content: { ...search } };
}

export async function _deleteReview(id: number) {
  await prisma.review.delete({ where: { id } });
}

export async function _deleteManyReviews(query: string) {
  await prisma.review.deleteMany({
    where: _getWhere(query),
  });
}
