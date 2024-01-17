"use server";

import prisma from "@/lib/prisma";
import { FetchFunctionProps } from "@/hooks/use-list";
import { convertSortDescriptorToPrisma } from "@/util/sort-descriptor-converter";
import { Key } from "react";
import { SortDirection } from "@react-types/shared";
import { UserSelectDto } from "@/service/user/impl/type";

const SIZE_PAGE_SIZE = 10;

export async function _fetchUserById(id: string | undefined) {
  if (!id) return { errMsg: "Id id undefined", value: null };

  const user = await prisma.user.findUnique({
    where: { id },
    select: UserSelectDto,
  });

  return {
    errMsg: user ? null : "Could not find user with specified Id",
    value: user,
  };
}

export async function _fetchUserByEmail(email: string) {
  if (!email) return { errMsg: "email is undefined", value: null };

  const user = await prisma.user.findUnique({
    where: { email },
    select: UserSelectDto,
  });

  return {
    errMsg: user ? null : "Could not find user with specified email",
    value: user,
  };
}

export async function _fetchAllUsers() {
  return prisma.user.findMany({
    select: UserSelectDto,
  });
}

export async function _fetchUserAccountByUserId(userId: string) {
  return prisma.account.findFirst({
    where: { userId },
  });
}

export async function _fetchUsers({
  query,
  page,
  sortColumn,
  sortDirection,
}: FetchFunctionProps) {
  const pages = await _countPages(query);
  if (page < 0 || pages === 0 || page > pages) {
    return {
      items: [],
      pages,
    };
  }

  const items = await _findUsers(query, page, sortColumn, sortDirection);

  return {
    items,
    pages,
  };
}

async function _countPages(query: string) {
  const count = await prisma.user.count({
    where: {
      OR: [
        { name: { contains: query } },
        { email: { contains: query } },
        { phone: { contains: query } },
      ],
    },
  });
  return Math.ceil(count / SIZE_PAGE_SIZE);
}

async function _findUsers(
  query: string,
  page: number,
  sortColumn: Key,
  sortDirection: SortDirection,
) {
  const sortDir = convertSortDescriptorToPrisma(sortDirection);
  const orderBy = {};
  // @ts-ignore
  orderBy[sortColumn] = sortDir;

  return prisma.user.findMany({
    orderBy,
    take: SIZE_PAGE_SIZE,
    skip: (page - 1) * SIZE_PAGE_SIZE,
    select: UserSelectDto,
    where: {
      OR: [
        { name: { contains: query } },
        { email: { contains: query } },
        { phone: { contains: query } },
      ],
    },
  });
}
