"use server";
import {prisma} from "@/lib/prisma";
import getUser from "@/utils/getUser";
import {ProductWithVariantsSerialized} from "@/types";
import {revalidatePath} from "next/cache";

export async function getProducts(): Promise<ProductWithVariantsSerialized[]> {
    const products = await prisma.product.findMany({
        include: {
            category: true,
            variants: {
                include: {
                    images: {take: 1},
                },
            },
        },
        orderBy: {createdAt: "desc"},
    });

    return products.map((product) => ({
        ...product,
        price: product.price.toString(),
        salePrice: product.salePrice ? product.salePrice.toString() : null,

        variants: product.variants.map((variant) => ({
            ...variant,
        })),
    }));
}

export async function getProductById(id: number) {
    return await prisma.product.findUnique({
        where: {id},
        include: {
            variants: true,
        },
    });
}

export async function addToCart(
    productId: number,
    variantId: number,
    quantity: number = 1,
) {
    const user = await getUser();
    if (!user) throw new Error("Niste prijavljeni");

    if (quantity < 1 || quantity > 99) throw new Error("Neispravan broj komada");

    const cart = await prisma.cart.upsert({
        where: {userId: user.id},
        create: {userId: user.id},
        update: {},
    });

    await prisma.cartItem.upsert({
        where: {
            cartId_productId_variantId: {
                cartId: cart.id,
                productId,
                variantId,
            },
        },
        create: {
            cartId: cart.id,
            productId,
            variantId,
            quantity,
        },
        update: {
            quantity: {increment: quantity},
        },
    });
}

export async function addToFavourites(productId: number) {
    const user = await getUser();
    if (!user) throw new Error("Niste prijavljeni");

    const userId = user.id
    const exist = await prisma.favourites.findUnique({
        where: {
            userId_productId: {userId, productId},
        },
    });

    if (exist) {
        await prisma.favourites.delete({
            where: {
                userId_productId: {userId, productId},
            },
        });
        revalidatePath("/account/favourites");
        return {favourtied: false};
    } else {
        await prisma.favourites.create({
            data: {productId, userId},
        });
        revalidatePath("/account/favourites");
        return {favourtied: true};
    }
}

export async function isFavourtied(productId: number, userId: string) {
    const exist = await prisma.favourites.findUnique({
        where: {
            userId_productId: {userId, productId},
        },
    });
    return exist;
}

export async function countFavourited(userId: string) {
    const count = await prisma.favourites.count({
        where: {userId},
    });
    return count as number;
}
