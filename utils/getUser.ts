"use server"
import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export default async function getUser() {
    const session = await auth();

    if (!session?.user?.id) return null;

    const allInfo = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    return {
        image: allInfo?.image ?? null,
        role: allInfo?.role ?? null,
        email: allInfo?.email ?? "",
        name: allInfo?.name ?? "",
        id: allInfo?.id ?? "",
    };
}
