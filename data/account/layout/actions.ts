import { prisma } from "@/lib/prisma";

export async function getLatestOrder(id: string) {
  const order = await prisma.order.findFirst({
    where: {
      userId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          product: true,
          variant: {
            include: {
              images: { orderBy: { order: "asc" }, take: 1 },
            },
          },
        },
      },
    },
  });
  const count = order?.items.length;
  return { ...order, count };
}
export async function recentNotifications(id: string) {
  const messages = await prisma.notification.findMany({
    where: {
      userId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
  return messages;
}
