import { NextRequest } from "next/server";
import {OrderService} from "@/service/order/order-service";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sign = req.headers.get("x-sign")

  console.log("---> request sign header:", sign);
  console.log("---> request body:", body);

  if (!sign) return new Response();

  let resp =  await (await fetch("https://api.monobank.ua/api/merchant/pubkey", {
    headers: {
      'X-Token': process.env.MONOBANK_API_KEY!
    }
  })).json()

  const crypto = require('crypto');


  let message = body.string;

  let signatureBuf = Buffer.from(sign, 'base64');
  let publicKeyBuf = Buffer.from(resp, 'base64');

  let verify = crypto.createVerify('SHA256');

  verify.write(message);
  verify.end();

  let result = verify.verify(publicKeyBuf, signatureBuf);

  if(result){
    if (body.status === "success") await OrderService.instance.confirmOrder(body.reference);
  }else{
    console.log("blyat")
  }



  return new Response();
}
