"use server";

import prisma from "@/lib/prisma";
import { FetchFunctionProps } from "@/hooks/use-list";
import { convertSortDescriptorToPrisma } from "@/util/sort-descriptor-converter";
import { SortDirection } from "@react-types/shared";

import { Key } from "react";
import { ReviewStatus } from "@prisma/client";

const REVIEW_PAGE_SIZE = 10;

export async function _fetchLatest() {
  return prisma.review.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    select: {
      user: { select: { username: true } },
      content: true,
      rating: true,
    },
    take: 10,
  });
}

export async function _fetchReviewById(id: number) {
  const review = await prisma.review.findUnique({ where: { id } });

  return {
    errMsg: review ? null : "Could not find review with specified Id",
    value: review,
  };
}

export async function _fetchAllReviews() {
  return prisma.review.findMany({
    select: {
      user: { select: { username: true } },
      content: true,
      rating: true,
      createdAt: true,
    },
    where: {
      status: "APPROVED",
    },
  });
}

export async function _fetchApprovedReviews({
  page,
  sortColumn,
  sortDirection,
}: FetchFunctionProps) {
  const pageSize = 3;

  const pages = await _countPages(_getWhere("", "APPROVED"), pageSize);
  if (page < 0 || page > pages) {
    return {
      items: [],
      pages,
    };
  }

  const sortDir = convertSortDescriptorToPrisma(sortDirection);
  const orderBy = {};
  // @ts-ignore
  orderBy[sortColumn] = sortDir;

  const items = await prisma.review.findMany({
    orderBy,
    take: pageSize,
    skip: (page - 1) * pageSize,
    select: {
      user: { select: { username: true } },
      content: true,
      rating: true,
      createdAt: true,
    },

    where: _getWhere("", "APPROVED"),
  });

  return {
    items,
    pages,
  };
}

export async function _fetchReview({
  query,
  page,
  sortColumn,
  sortDirection,
}: FetchFunctionProps) {
  const pages = await _countPages(_getWhere(query), REVIEW_PAGE_SIZE);
  if (page < 0 || page > pages) {
    return {
      items: [],
      pages,
    };
  }

  const items = await _findReview(
    _getWhere(query),
    page,
    sortColumn,
    sortDirection,
  );

  return {
    items,
    pages,
  };
}

function _getWhere(query: string | undefined, status?: ReviewStatus) {
  let search: { search: string } | undefined;
  if (query && query.length > 0) search = { search: `${query}*` };

  let statusFilter: {} | undefined;
  if (status) {
    statusFilter = { status };
  }

  return { content: { ...search }, ...statusFilter };
}

async function _countPages(where: {}, size: number) {
  const count = await prisma.review.count({
    where,
  });
  return Math.ceil(count / size);
}

async function _findReview(
  where: {},
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
    take: REVIEW_PAGE_SIZE,
    skip: (page - 1) * REVIEW_PAGE_SIZE,
    where: where,
  });
}
