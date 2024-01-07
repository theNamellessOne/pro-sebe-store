import { UserService } from "@/app/dashboard/(pages)/users/service/user-service";
import { NextRequest } from "next/server";

type CheckAuthSlug = { params: { id: string } };

async function handler(req: NextRequest, { params }: CheckAuthSlug) {
  return Response.json(await UserService.instance.fetchById(params.id));
}

export const GET = handler;
