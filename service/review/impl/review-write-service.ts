"use server";

import { ReviewSave, reviewSchema } from "@/schema/review/review-schema";
import prisma from "@/lib/prisma";
import { auth } from "@/auth/auth";
import { ReviewStatus } from "@prisma/client";

export async function _saveReview(review: ReviewSave) {
  return review.id ? _updateReview(review) : _createReview(review);
}

async function _createReview(review: ReviewSave) {
  const user = await auth();
  const userId = user?.user.id;

  if (!userId) {
    return {
      errMsg: "Користувач не авторизований!",
      value: null,
    };
  }

  if (!reviewSchema.safeParse(review)) {
    return {
      errMsg: "Некоректні дані!",
      value: null,
    };
  }

  const exists = await prisma.review.findFirst({
    where: { userId, status: "ON_MODERATION" },
  });

  if (exists) {
    return {
      errMsg: "Ви поки що не можете залишати відгуки!",
      value: null,
    };
  }

  return {
    errMsg: null,
    value: await prisma.review.create({ data: { ...review, userId: userId } }),
  };
}

async function _updateReview(review: ReviewSave) {
  if (!reviewSchema.safeParse(review)) {
    return {
      errMsg: "Некоректні дані!",
      value: null,
    };
  }

  const id = review.id;

  return {
    errMsg: null,
    value: await prisma.review.update({
      where: { id },
      data: {
        ...review,
        id: undefined,
      },
    }),
  };
}

export async function _setStatus(id: number, status: ReviewStatus) {
  return prisma.review.update({
    where: { id: id },
    data: {
      status,
    },
  });
}

function _getWhere(query: string | undefined) {
  let search: { search: string } | undefined;
  if (query && query.length > 0) search = { search: `${query}*` };

  return { content: { ...search } };
}

export async function _setStatusMany(query: string, status: ReviewStatus) {
  await prisma.review.updateMany({
    where: _getWhere(query),
    data: {
      status,
    },
  });
}

export async function _setStatusManyById(ids: number[], status: ReviewStatus) {
  await prisma.review.updateMany({
    where: {
      id: { in: ids },
    },
    data: { status },
  });
}
