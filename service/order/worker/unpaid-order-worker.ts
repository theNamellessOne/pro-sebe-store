import prisma from "@/lib/prisma";

let working = false;

async function deleteUnpaidOrder(order: any) {
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

      await prisma.order.delete({ where: { id: order.id } });
    });
  } catch (err) {
    console.log(err);
  }
}

async function processUnpaidOrders() {
  try {
    const unpaidOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          lte: new Date(Date.now() - 60 * 60 * 1000), // 60 minutes ago
        },
      },
      include: {
        orderItems: true,
      },
    });

    for (const unpaidOrder of unpaidOrders) {
      await deleteUnpaidOrder(unpaidOrder);
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
