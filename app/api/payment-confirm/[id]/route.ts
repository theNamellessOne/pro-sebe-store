import { OrderService } from "@/service/order/order-service";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

type OrderSlug = { params: { id: string } };

export async function GET(_: NextRequest, { params }: OrderSlug) {
  await OrderService.instance.confirmOrder(params.id);

  redirect("/home");
}
