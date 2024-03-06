import { NextRequest } from "next/server";

const recommender = require("./recommender.node");

type Slug = { params: { article: string } };

export async function GET(_: NextRequest, { params }: Slug) {
    let start = Date.now();
    const articles: string = await recommender.recommend(
        process.env.DATABASE_URL,
        params.article,
    );


    return Response.json(articles);
}