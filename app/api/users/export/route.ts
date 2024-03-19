import prisma from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({
    select: { email: true },
  });

  const content = users.map((user) => user.email).join("\n");

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": 'attachment; filename="file.txt"',
    },
  });
}
