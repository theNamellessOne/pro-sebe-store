import { UserService } from "@/service/user/user-service";
import { NextRequest } from "next/server";

type CheckAuthSlug = { params: { id: string } };

async function handler(_: NextRequest, { params }: CheckAuthSlug) {
  return Response.json(await UserService.instance.fetchById(params.id));
}

export const GET = handler;
