"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import getUser from "@/utils/getUser";
import { redirect } from "next/navigation";

export async function updateReadStatus(notificationID: number) {
  await prisma.notification.update({
    where: { id: notificationID },
    data: { read: true },
  });
  revalidatePath("/account/notifications");
}

export async function getUnreadMsgs() {
  const user = await getUser();
  if (!user) return 0;
  const count = await prisma.notification.count({
    where: {
      userId: user?.id,
      read: false,
    },
  });
  return count;
}
