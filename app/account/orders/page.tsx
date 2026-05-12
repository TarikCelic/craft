import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import getUser from "@/utils/getUser";
import AccountOrdersClient from "./AccountOrdersClient";

export default async function Page() {
  const user = await getUser();

  const orders = await prisma.order.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      total: true,
      createdAt: true,
      items: {
        take: 1,
        select: {
          product: {
            select: { name: true },
          },
          variant: {
            select: {
              images: {
                orderBy: { order: "asc" },
                take: 1,
                select: { url: true },
              },
            },
          },
        },
      },
      _count: {
        select: { items: true },
      },
    },
  });

  const serializedOrders = orders.map((order) => ({
    ...order,
    total: Number(order.total),
    createdAt: new Intl.DateTimeFormat("bs-BA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(order.createdAt),
  }));

  return <AccountOrdersClient orders={serializedOrders} />;
}
