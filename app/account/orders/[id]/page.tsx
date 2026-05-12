import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import getUser from "@/utils/getUser";
import OrderDetailClient from "./OrderDetailClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect("/login");

  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, price: true } },
          variant: {
            include: {
              images: { orderBy: { order: "asc" }, take: 1 },
            },
          },
        },
      },
    },
  });

  if (!order || order.userId !== user.id) notFound();

  const serialized = {
    ...order,
    total: Number(order.total),
    createdAt: new Intl.DateTimeFormat("bs-BA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(order.createdAt),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
      product: { ...item.product, price: Number(item.product.price) },
    })),
  };

  return <OrderDetailClient order={serialized} />;
}
