import { NextRequest } from "next/server";
import {OrderService} from "@/service/order/order-service";

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log("---> request sign header:", req.headers.get("x-sign"));
  console.log("---> request body:", body);

  if (body.status === "success") await OrderService.instance.confirmOrder(body.reference);

  return new Response();
}
