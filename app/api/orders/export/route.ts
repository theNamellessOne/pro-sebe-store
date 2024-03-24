import prisma from "@/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
    select: { email: true },
  });

  const emails = orders.map((order) => order.email);
  const content = Array.from(new Set(emails)).join("\n");

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": 'attachment; filename="file.txt"',
    },
  });
}
