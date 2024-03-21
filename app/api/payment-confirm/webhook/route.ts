import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  console.log("---> request headers:", req.headers);
  console.log("---> request body:", await req.json());
}
