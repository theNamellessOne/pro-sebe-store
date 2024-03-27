import { NextRequest } from "next/server";
import { OrderService } from "@/service/order/order-service";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sign = req.headers.get("x-sign");

  console.log("---> request sign header:", sign);
  console.log("---> request body:", body);

  if (!sign) return new Response();

  const resp = await (await fetch("https://api.monobank.ua/api/merchant/pubkey", {
    headers: {
      'X-Token': process.env.MONOBANK_API_KEY!
    }
  })).json();

  const crypto = require('crypto');

  const message = JSON.stringify(body);

  const signatureBuf = Buffer.from(sign, 'base64');
  const publicKeyBuf = Buffer.from(resp.key, 'base64');

  const verify = crypto.createVerify('sha256');

  verify.update(message);

  const result = verify.verify(publicKeyBuf, signatureBuf);

  if (result) {
    if (body.status === "success") await OrderService.instance.confirmOrder(body.reference);
  } else {
    console.log("blyat");
  }

  return new Response();
}
