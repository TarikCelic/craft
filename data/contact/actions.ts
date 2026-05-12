"use server";
import {prisma} from "@/lib/prisma";
import getUser from "@/utils/getUser";
import {AnswerStatus} from "@/app/generated/prisma";

export default async function SendMessage(
    sender: string,
    email: string,
    subject: string,
    message: string,
    id?: string,
) {
    const user = await getUser();

    await prisma.message.create({
        data: {
            subject,
            email,
            status: AnswerStatus.UNANSWERED,
            sender,
            message,
            ...(id && {userId: id}),
        },
    });
}
