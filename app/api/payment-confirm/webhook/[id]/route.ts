import { NextRequest } from "next/server";

type OrderSlug = { params: { id: string } };

export async function POST(req: NextRequest, { params }: OrderSlug) {
  console.log("---> params:", params);
  console.log("---> request body:", await req.json());
}
