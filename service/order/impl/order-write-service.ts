"use server";

import prisma from "@/lib/prisma";
import { OrderInput } from "@/schema/order/order-schema";
import { OrderPaymentType, OrderStatus, ProductStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { redirect } from "next/navigation";
import { exit } from "process";
import { OrderService } from "../order-service";
import { MiscService } from "@/service/misc/misc-service";
import { auth } from "@/auth/auth";

function calculatePercentage(part: number, whole: number) {
  if (whole === 0) {
    return 0;
  }

  return (part / whole) * 100;
}

const MONOBANK_API_KEY = process.env.MONOBANK_API_KEY;

if (!MONOBANK_API_KEY) exit();

type MonobankRequest = {
  amount: number;
  merchantPaymInfo: {
    reference: string;
    destination: string;
    comment: string;
    customerEmails: string[];
    basketOrder: {
      name: string;
      qty: number;
      sum: number;
      icon: string;
      unit: string;
      code: string;
      discounts: {
        type: "DISCOUNT" | "EXTRA_CHARGE";
        mode: "PERCENT" | "VALUE";
        value: number;
      }[];
    }[];
  };
  redirectUrl: string;
  webHookUrl: string;
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
  const session = await auth();
  let redirectUrl = "";

  try {
    let value: any = undefined;

    const misc = await MiscService.instance.fetch();
    if (!misc) throw "misc is undefined";

    const hasDiscount = await OrderService.instance.hasDiscount(
      order.contactInfo.email,
    );

    const mono: MonobankRequest = {
      amount: 0,
      merchantPaymInfo: {
        reference: "",
        customerEmails: [order.contactInfo.email],
        destination: "куда нада",
        comment: "куда нада",
        basketOrder: [],
      },
      redirectUrl: "",
      webHookUrl: "",
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

          const mediaUrls = item.variant.mediaUrls as { url: string }[];
          total = total.add(item.variant.product.price.mul(item.quantity));
          mono.merchantPaymInfo.basketOrder.push({
            name: item.variant.product.name,
            qty: item.quantity,
            sum: item.variant.product.price.mul(100).toNumber(),
            icon: mediaUrls.length > 0 ? mediaUrls[0].url : "no",
            unit: "банан",
            code: item.variant.productArticle,
            discounts: hasDiscount
              ? [
                  {
                    type: "DISCOUNT",
                    mode: "PERCENT",
                    value: misc.secondOrderDiscount,
                  },
                ]
              : [],
          });

          orderItems.push({
            productName: item.variant.product.name,
            productArticle: item.variant.productArticle,

            variantName: item.variant.name,
            variantImgUrl: mediaUrls.length > 0 ? mediaUrls[0].url : "",
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

        const discount = hasDiscount
          ? calculatePercentage(misc?.secondOrderDiscount, total.toNumber())
          : 0;

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

            paymentType: cart.subtotal.gt(new Decimal(150))
              ? order.paymentType
              : OrderPaymentType.PREPAID,

            total: total.minus(new Decimal(discount)),

            userId: session ? session.user.id : undefined,

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
        mono.redirectUrl = `${process.env.BASE_URL!}/api/payment-confirm/${value.id}`;
        mono.webHookUrl = `${process.env.BASE_URL!}/api/payment-confirm/webhook`
      },
      { timeout: 15000 },
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
    if (err.message.includes("prisma"))
      return { errMsg: "щось пішло не так", value: null };

    return { errMsg: err.message, value: null };
  }

  if (redirectUrl !== "") redirect(redirectUrl);
}

function _decideProductVariantStockAction(
  currentStatus: OrderStatus,
  newStatus: OrderStatus,
  item: { quantity: number },
): {
  sold?: {
    increment?: number;
    decrement?: number;
  };
  quantity?: {
    increment?: number;
    decrement?: number;
  };
  reserved?: {
    increment?: number;
    decrement?: number;
  };
} {
  switch (newStatus) {
    case OrderStatus.RETURNED:
    case OrderStatus.CANCELED:
      if (
        currentStatus === OrderStatus.PAID ||
        currentStatus === OrderStatus.CREATED
      ) {
        return {
          reserved: { decrement: item.quantity },
          quantity: { increment: item.quantity },
        };
      }

      if (
        currentStatus === OrderStatus.PACKED ||
        currentStatus === OrderStatus.DELIVERED
      ) {
        return {
          sold: { decrement: item.quantity },
          quantity: { increment: item.quantity },
        };
      }

      return {};

    case OrderStatus.PACKED:
    case OrderStatus.DELIVERED:
      if (
        currentStatus === OrderStatus.RETURNED ||
        currentStatus === OrderStatus.CANCELED
      ) {
        return {
          sold: { increment: item.quantity },
          quantity: { decrement: item.quantity },
        };
      }

      if (
        currentStatus === OrderStatus.PAID ||
        currentStatus === OrderStatus.CREATED
      ) {
        return {
          reserved: { decrement: item.quantity },
          sold: { increment: item.quantity },
        };
      }

      return {};

    default:
      return {};
  }
}

async function _updateProductStock(order: any, newStatus: OrderStatus) {
  const currentStatus = order.status;

  await prisma.$transaction(async (prisma) => {
    const promises: Promise<any>[] = [];
    for (const item of order.orderItems) {
      promises.push(
        prisma.variant.updateMany({
          where: {
            name: item.variantName,
            productArticle: item.productArticle,
          },
          data: _decideProductVariantStockAction(
            currentStatus,
            newStatus,
            item,
          ),
        }),
      );
    }

    await Promise.all(promises);
  });
}

export async function _setStatus(orderId: string, status: OrderStatus) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
      },
    });

    await _updateProductStock(order, status);
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
            },
          },
        },
      },
    },
  });
}
