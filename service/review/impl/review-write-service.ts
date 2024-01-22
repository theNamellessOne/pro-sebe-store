"use server";

import {ReviewSave, reviewSchema} from "@/schema/review/review-schema";
import prisma from "@/lib/prisma";
import {auth} from "@/auth/auth";

export async function _saveReview(review: ReviewSave) {
    return review.id ? _updateReview(review) : _createReview(review);
}

async function _createReview(review: ReviewSave) {

    const user = await auth()
    const userId = user?.user.id

    if (!userId) {
        return {
            errMsg: "user is not authorized",
            value: null,
        };
    }

    if (!reviewSchema.safeParse(review)) {
        return {
            errMsg: "invalid data",
            value: null,
        };
    }

    return {
        errMsg: null,
        value: await prisma.review.create({data: {...review, userId: userId}})
    };
}

async function _updateReview(review: ReviewSave) {
    if (!reviewSchema.safeParse(review)) {
        return {
            errMsg: "invalid data",
            value: null,
        };
    }

    const id = review.id;

    return {
        errMsg: null,
        value: await prisma.review.update({
            where: {id},
            data: {
                ...review,
                id: undefined,
            },
        }),
    };
}