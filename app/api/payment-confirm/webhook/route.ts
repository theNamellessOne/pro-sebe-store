import {NextRequest} from "next/server";
import { OrderService } from "@/service/order/order-service";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sign = req.headers.get("x-sign");

  console.log("---> request sign header:", sign);
  console.log("---> request body:", body);

  if (!sign) return new Response();

  const resp = await (
    await fetch("https://api.monobank.ua/api/merchant/pubkey", {
      headers: {
        "X-Token": process.env.MONOBANK_API_KEY!,
      },
    })
  ).json();

  const crypto = require("crypto");

  const message = JSON.stringify(body);

  console.log(sign);  
  console.log(resp);
  
  const signatureBuf = Buffer.from(sign, "base64");
  const publicKeyBuf = Buffer.from(resp, "base64");

  console.log(signatureBuf);  
  console.log(publicKeyBuf);

  const verify = crypto.createVerify("sha256");

  verify.write(message);
  verify.end();

  const result = verify.verify(publicKeyBuf, signatureBuf);

  console.log(resp);
  console.log(result);

  if (result) {
    if (body.status === "success")
      await OrderService.instance.confirmOrder(body.reference);
  } else {
    return new Response("", {status: 403});
  }

  return new Response();
}
