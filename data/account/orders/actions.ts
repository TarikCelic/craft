"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import getUser from "@/utils/getUser";

export async function cancelOrder(orderId: number) {
  const user = await getUser();
  if (!user) return { success: false, error: "Niste prijavljeni." };

  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order || order.userId !== user.id)
    return { success: false, error: "Narudžba nije pronađena." };

  if (order.status !== "PENDING")
    return {
      success: false,
      error: "Samo narudžbe na čekanju se mogu otkazati.",
    };

  await prisma.order.delete({ where: { id: orderId } });

  revalidatePath("/account/orders");
  return { success: true };
}

export async function removeOrderItem(orderId: number, itemId: number) {
  const user = await getUser();
  if (!user) return { success: false, error: "Niste prijavljeni." };

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.userId !== user.id)
    return { success: false, error: "Narudžba nije pronađena." };

  if (order.status !== "PENDING")
    return { success: false, error: "Nije moguće ukloniti stavku." };

  if (order.items.length <= 1)
    return {
      success: false,
      error: "Ne možete ukloniti jedinu stavku. Otkažite narudžbu.",
    };

  await prisma.orderItem.delete({ where: { id: itemId } });

  const remaining = order.items.filter((i) => i.id !== itemId);
  const newTotal = remaining.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0,
  );
  await prisma.order.update({
    where: { id: orderId },
    data: { total: newTotal },
  });

  revalidatePath(`/account/orders/${orderId}`);
  return { success: true };
}
