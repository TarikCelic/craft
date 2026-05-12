"use server";
import { prisma } from "@/lib/prisma";
import { AnswerStatus } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";

export async function AnswerQuestion(answer: string, id: string) {
  await prisma.notification.create({
    data: {
      userId: id,
      message: answer,
      title: "Answer from administrator",
    },
  });
}

export async function updateMessageStatus(
  id: number,
  status: AnswerStatus,
  answer?: string,
  userId?: string,
) {
  try {
    await prisma.message.update({
      where: { id },
      data: {
        status,
      },
    });

    if (userId && answer) {
      await prisma.notification.create({
        data: {
          title: "Answer from administrator",
          message: answer,
          userId,
        },
      });
    }

    revalidatePath("/admin/messages");
    return { success: true };
  } catch {
    return { success: false, error: "Greška pri ažuriranju statusa." };
  }
}
