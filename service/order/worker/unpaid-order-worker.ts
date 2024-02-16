import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

let working = false;

async function cancelUnpaidOrder(order: any) {
  try {
    await prisma.$transaction(async (prisma) => {
      for (const item of order.orderItems) {
        await prisma.variant.updateMany({
          where: {
            name: item.variantName,
            productArticle: item.productArticle,
          },
          data: {
            quantity: { increment: item.quantity },
            reserved: { decrement: item.quantity },
          },
        });
      }

      await prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.CANCELED },
      });
    });
  } catch (err) {
    console.log(err);
  }
}

async function processUnpaidOrders() {
  try {
    const unpaidOrders = await prisma.order.findMany({
      where: {
        status: OrderStatus.CREATED,
        createdAt: {
          lte: new Date(Date.now() - 60 * 60 * 1000), // 60 minutes ago
        },
      },
      include: {
        orderItems: true,
      },
    });

    for (const unpaidOrder of unpaidOrders) {
      await cancelUnpaidOrder(unpaidOrder);
    }
  } finally {
    working = false;
  }
}

export function _initializeUnpaidOrderWorker() {
  setInterval(
    () => {
      if (!working) {
        working = true;
        processUnpaidOrders();
      }
    },
    10 * 60 * 1000,
  ); // Run every 10 minutes
}
