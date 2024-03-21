import { NextRequest } from "next/server";
import {OrderService} from "@/service/order/order-service";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sign = req.headers.get("x-sign")

  console.log("---> request sign header:", sign);
  console.log("---> request body:", body);

  if (!sign) return new Response();

  console.log("---> pubkey", await fetch("https://api.monobank.ua/api/merchant/pubkey", {
    headers: {
      'X-Token': process.env.MONOBANK_API_KEY!
    }
  }))
  if (body.status === "success") await OrderService.instance.confirmOrder(body.reference);

  return new Response();
}
