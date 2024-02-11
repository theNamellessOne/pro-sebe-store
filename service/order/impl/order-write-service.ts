"use server";

import prisma from "@/lib/prisma";
import { OrderInput } from "@/schema/order/order-schema";
import { ProductStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export async function _placeOrder(cartId: string, order: OrderInput) {
  try {
    let value;
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

        orderItems.push({
          productName: item.variant.product.name,
          productArticle: item.variant.productArticle,

          variantName: item.variant.name,
          variantImgUrl: item.variant.mediaUrls
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
    });

    return { errMsg: "", value };
  } catch (err: any) {
    console.log(err);
    return { errMsg: err.message, value: null };
  }
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
