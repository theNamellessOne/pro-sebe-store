"use server";

import prisma from "@/lib/prisma";
import {FetchFunctionProps} from "@/hooks/use-list";
import {convertSortDescriptorToPrisma} from "@/util/sort-descriptor-converter";
import {SortDirection} from "@react-types/shared";

import {Key} from "react";

const COLOR_PAGE_SIZE = 10;

export async function _fetchReviewById(id: number) {
    const review = await prisma.review.findUnique({where: {id}});

    return {
        errMsg: review ? null : "Could not find review with specified Id",
        value: review,
    };
}

export async function _fetchAllReview() {
    return prisma.review.findMany();
}

export async function _fetchReview({
                                       query,
                                       page,
                                       sortColumn,
                                       sortDirection,
                                   }: FetchFunctionProps) {
    const pages = await _countPages(query);
    if (page < 0 || page > pages) {
        return {
            items: [],
            pages,
        };
    }

    const items = await _findReview(query, page, sortColumn, sortDirection);

    return {
        items,
        pages,
    };
}

async function _countPages(query: string) {
    const count = await prisma.review.count({
        where: {
            content: {
                contains: query,
            },
        },
    });
    return Math.ceil(count / COLOR_PAGE_SIZE);
}

async function _findReview(
    query: string,
    page: number,
    sortColumn: Key,
    sortDirection: SortDirection,
) {
    const sortDir = convertSortDescriptorToPrisma(sortDirection);
    const orderBy = {};
    // @ts-ignore
    orderBy[sortColumn] = sortDir;

    return prisma.review.findMany({
        orderBy,
        take: COLOR_PAGE_SIZE,
        skip: (page - 1) * COLOR_PAGE_SIZE,
        where: {
            content: {
                contains: query,
            },
        },
    });
}