"use server"

import {prisma} from "@/lib/prisma";
import getUser from "@/utils/getUser";
import {revalidatePath} from "next/cache";
import {Role} from "@/app/generated/prisma"

export async function DeleteUser(userId: string) {
    const user = await getUser();
    if (user?.id !== userId) {
        await prisma.user.delete({
            where: {
                id: userId,
            }
        })
        revalidatePath("/admin/users");
    } else {
        return {error: "You cannot delete yourself"};
    }
}

export async function UpdateRole(userId: string, role: Role) {
    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            role: role,
        }
    })
    revalidatePath("/admin/users");
}