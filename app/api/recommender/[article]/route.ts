import {NextRequest} from "next/server";
import prisma from "@/lib/prisma";
import {ProductStatus} from "@prisma/client";

const recommender = require("./recommender.node");

type Slug = { params: { article: string } };

export async function GET(_: NextRequest, { params }: Slug) {
    let start = Date.now();
    const articles: string = await recommender.recommend(
        process.env.DATABASE_URL,
        params.article,
    );

    const products = await prisma.product.findMany({
        where: {
            status: ProductStatus.ACTIVE,
            variants: {
                some: { quantity: { gt: 0 } },
            },
            article: {
                in: articles.split(" "),
            },
        },
        include: {
            variants: true,
        },
    });

    console.log(articles);
    console.log("time :", Date.now() - start);

    return Response.json(products);
}