"use client";

import { Button } from "@nextui-org/button";
import axios from "axios";
import { useRouter } from "next/navigation";

const test = {
  amount: 4200,
  merchantPaymInfo: {
    reference: "84d0070ee4e44667b31371d8f8813947",
    destination: "suka",
    comment: "suka",
    customerEmails: [],
    basketOrder: [
      {
        name: "Suka",
        qty: 2,
        sum: 2100,
        icon: "data:image/png;base64,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",
        unit: "suka.",
        code: "d21da1c47f3c45fca10a10c32518bdeb",
      },
    ],
  },
  redirectUrl: "http://localhost:3000",
  webHookUrl: "https://webhook-callback-test.vercel.app/api/webHook",
  validity: 3600,
  paymentType: "debit",
};

export default function Page() {
  const router = useRouter();
  const handle = () => {
    axios
      .post("https://api.monobank.ua/api/merchant/invoice/create", test, {
        headers: {
          "X-Token": "uBtCG2NPAY3uf4LghnQErQXRcZM8CxnnUWjWUQdAZRwI",
        },
      })
      .then((res) => router.push(res.data.pageUrl));
  };

  return <Button onClick={handle}>click</Button>;
}
