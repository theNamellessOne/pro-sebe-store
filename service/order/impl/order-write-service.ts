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
    let value: Order | undefined = undefined;

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

    await prisma.$transaction(async (prisma) => {
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

      for (const item of cart.cartItems) {
        if (item.variant.quantity < item.quantity) {
          throw new Error(
            `insufficient stock for ${item.variant.product.name}`,
          );
        }

        if (item.variant.product.status !== ProductStatus.ACTIVE) {
          throw new Error(`product not found - ${item.variant.product.name}`);
        }

        if (!item.variant.product.price.eq(item.subtotal.div(item.quantity))) {
          throw new Error(`product not found - ${item.variant.product.name}`);
        }

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

        await prisma.variant.update({
          where: { id: item.variantId },
          data: {
            quantity: { decrement: item.quantity },
            reserved: { increment: item.quantity },
          },
        });
      }

      value = await prisma.order.create({
        data: {
          ...order.contactInfo,

          orderDeliveryType: order.deliveryInfo.deliveryType,

          settlementRef: order.deliveryInfo.settlementRef,

          street: order.deliveryInfo.addressParts?.street,
          houseNo: order.deliveryInfo.addressParts?.houseNo,
          postalIdx: order.deliveryInfo.addressParts?.postalIdx,

          warehouseKey: order.deliveryInfo.warehouseKey,

          paymentType: order.paymentType,

          total: cart.subtotal,

          orderItems: {
            createMany: { data: orderItems },
          },
        },
      });

      await prisma.cart.delete({ where: { id: cart.id } });

      if (order.paymentType === OrderPaymentType.PREPAID) {
        mono.amount = value.total.mul(100).toNumber();
      }

      if (order.paymentType === OrderPaymentType.POSTPAID) {
        mono.amount = 15000;
      }

      mono.amount = 1;
      mono.merchantPaymInfo.reference = value.id;
      mono.redirectUrl = `http://localhost:3000/api/payment-confirm/${value.id}`;
    });

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

// @ts-ignore
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
