"use server";

import prisma from "@/lib/prisma";
import { OrderInput } from "@/schema/order/order-schema";
import {
  Order,
  OrderPaymentType,
  OrderStatus,
  ProductStatus,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { redirect } from "next/navigation";
import { exit } from "process";

const MONOBANK_API_KEY = process.env.MONOBANK_API_KEY;

if (!MONOBANK_API_KEY) exit();

type MonobankRequest = {
  amount: number;
  merchantPaymInfo: {
    reference: string;
    destination: string;
    comment: string;
    basketOrder: {
      name: string;
      qty: number;
      sum: number;
      icon: string;
      unit: string;
      code: string;
    }[];
  };
  redirectUrl: string;
  validity: number;
  paymentType: "debit" | "hold";
};

export async function _confirmOrder(orderId: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.PAID },
  });
}

export async function _placeOrder(cartId: string, order: OrderInput) {
  let redirectUrl = "";

  try {
    let value: any = undefined;

    const mono: MonobankRequest = {
      amount: 0,
      merchantPaymInfo: {
        reference: "",
        destination: "куда нада",
        comment: "куда нада",
        basketOrder: [],
      },
      redirectUrl: "",
      validity: 10 * 60 * 100, // 10 min
      paymentType: "debit",
    };

    await prisma.$transaction(
      async (prisma) => {
        const cart = await _fetchCartById(cartId);

        if (!cart) throw new Error("no cart");

        const orderItems: {
          productName: string;
          productArticle: string;

          variantName: string;
          variantImgUrl: string;
          variantSellingPrice: Decimal;

          quantity: number;
          subtotal: Decimal;
        }[] = [];

        let total = new Decimal(0);
        const promises: any = [];

        for (const item of cart.cartItems) {
          if (item.variant.quantity < item.quantity) {
            throw new Error(
              `insufficient stock for ${item.variant.product.name}`,
            );
          }

          if (item.variant.product.status !== ProductStatus.ACTIVE) {
            throw new Error(`product not found - ${item.variant.product.name}`);
          }

          total = total.add(item.variant.product.price.mul(item.quantity));
          mono.merchantPaymInfo.basketOrder.push({
            name: item.variant.product.name,
            qty: item.quantity,
            sum: item.variant.product.price.mul(100).toNumber(),
            icon:
              item.variant.mediaUrls.length > 0
                ? item.variant.mediaUrls[0].url
                : "no",
            unit: "банан",
            code: item.variant.productArticle,
          });

          orderItems.push({
            productName: item.variant.product.name,
            productArticle: item.variant.productArticle,

            variantName: item.variant.name,
            variantImgUrl:
              item.variant.mediaUrls.length > 0
                ? item.variant.mediaUrls[0].url
                : "",
            variantSellingPrice: item.variant.product.price,

            quantity: item.quantity,
            subtotal: item.subtotal,
          });

          promises.push(
            prisma.variant.update({
              where: { id: item.variantId },
              data: {
                quantity: { decrement: item.quantity },
                reserved: { increment: item.quantity },
              },
            }),
          );
        }

        promises.push(prisma.cart.delete({ where: { id: cart.id } }));
        await Promise.all(promises);

        value = await prisma.order.create({
          data: {
            ...order.contactInfo,

            orderDeliveryType: order.deliveryInfo.deliveryType,

            settlementRef: order.deliveryInfo.settlementRef,
            settlementDescription: order.deliveryInfo.settlementDescription,

            street: order.deliveryInfo.addressParts?.street,
            houseNo: order.deliveryInfo.addressParts?.houseNo,
            postalIdx: order.deliveryInfo.addressParts?.postalIdx,

            warehouseKey: order.deliveryInfo.warehouseKey,

            paymentType: order.paymentType,

            total: total,

            orderItems: {
              createMany: { data: orderItems },
            },
          },
        });

        if (order.paymentType === OrderPaymentType.PREPAID) {
          mono.amount = value.total.mul(100).toNumber();
        }

        if (order.paymentType === OrderPaymentType.POSTPAID) {
          mono.amount = 15000;
        }

        mono.amount = 1;
        mono.merchantPaymInfo.reference = value.id;
        mono.redirectUrl = `http://localhost:3000/api/payment-confirm/${value.id}`;
      },
      { timeout: 10000 },
    );

    const res = await fetch(
      "https://api.monobank.ua/api/merchant/invoice/create",
      {
        method: "POST",
        body: JSON.stringify(mono),
        headers: {
          "X-Token": MONOBANK_API_KEY!,
        },
      },
    );

    redirectUrl = (await res.json()).pageUrl;
  } catch (err: any) {
    console.log(err);
    return { errMsg: err.message, value: null };
  }

  if (redirectUrl !== "") redirect(redirectUrl);
}

export async function _setStatus(orderId: string, status: OrderStatus) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return { success: "статус оновлено" };
  } catch {
    return { error: "шось пішло не так" };
  }
}

async function _fetchCartById(cartId: string) {
  return prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      cartItems: {
        include: {
          variant: {
            include: {
              size: true,
              color: true,
              product: true,
              mediaUrls: true,
            },
          },
        },
      },
    },
  });
}
