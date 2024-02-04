"use server";

import prisma from "@/lib/prisma";

export async function _deleteReview(id: number) {
    prisma.$transaction(async () => _deleteReviewNonTransactional(id))
}

async function _deleteReviewNonTransactional(id: number) {
    const review = await prisma.review.findUnique({where: {id}});

    if (!review) {
        return {
            errMsg: "Review is not found!"
        }
    }

    await prisma.review.deleteMany({
        where: {
            id: id,
        },
    });

    await prisma.review.delete({where: {id}});
}

export async function _deleteManyReviews(query: string) {
    const reviewsToDelete = await prisma.review.findMany({
        where: {
            content: {
                contains: query,
            },
        },
    });

    await prisma.$transaction(
        async () => {
            for (let i = 0; i < reviewsToDelete.length; i++) {
                await _deleteReviewNonTransactional(reviewsToDelete[i].id)
            }
        },
        {
            maxWait: 5000,
            timeout: 10000,
        },
    );
}