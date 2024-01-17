import { UserService } from "@/service/user/user-service";
import { NextRequest } from "next/server";

type CheckAuthSlug = { params: { email: string } };

async function handler(_: NextRequest, { params }: CheckAuthSlug) {
  const { value } = await UserService.instance.fetchByEmail(params.email);
  return Response.json(value);
}

export const GET = handler;
