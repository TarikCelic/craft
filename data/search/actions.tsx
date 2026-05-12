"use server";
import {prisma} from "@/lib/prisma";

export async function handleQuery(q: string) {
    const match = await prisma.product.findMany({
        where: {
            name: {
                contains: q,
                mode: "insensitive",
            },
        },
        include: {
            category: true,
            variants: {
                include: {
                    images: {
                        take: 1,
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
    });

    return match.map((product) => ({
        ...product,
        id: product.id,
        name: product.name,
        categoryId: product.categoryId,
        price: Number(product.price),
        salePrice: product.salePrice ? Number(product.salePrice) : null,
        createdAt: product.createdAt.toISOString(),
    }));
}