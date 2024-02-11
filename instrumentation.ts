export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const uorw = await import("./service/order/worker/unpaid-order-worker");
    uorw._initializeUnpaidOrderWorker();
  }
}
