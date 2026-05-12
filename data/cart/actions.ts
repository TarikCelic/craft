"use server";
import {prisma} from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import getUser from "@/utils/getUser";
import {OrderDetails} from "@/types";

export async function ItemMinus(id: number) {

    const user = await getUser();
    if (!user) throw new Error("Niste prijavljeni");

    const item = await prisma.cartItem.findUnique({
        where: {id},
        include: {cart: true},
    });

    if (!item) return;
    if (item.quantity <= 1) {
        await prisma.cartItem.delete({
            where: {id},
        });
    } else {
        await prisma.cartItem.update({
            where: {id},
            data: {
                quantity: {
                    decrement: 1,
                },
            },
        });
    }

    revalidatePath("/cart");
}

export async function ItemDelete(id: number) {

    const user = await getUser();
    if (!user) throw new Error("Niste prijavljeni");

    const item = await prisma.cartItem.findUnique({
        where: {id},
        include: {cart: true},
    });

    if (!item || item.cart.userId !== user.id) throw new Error("Zabranjen pristup");

    await prisma.cartItem.delete({
        where: {id},
    });

    revalidatePath("/cart");
}


export async function makeOrder(details: OrderDetails) {
    const user = await getUser();
    if (!user) throw new Error("Niste prijavljeni");

    const cart = await prisma.cart.findUnique({
        where: {userId: user.id},
        include: {items: {include: {product: true}}},
    });

    if (!cart || cart.items.length === 0) return;

    const computedTotal = cart.items.reduce(
        (sum, item) => sum + Number(item.product.salePrice ?? item.product.price) * item.quantity,
        0
    );

    if (!details.firstName.trim() || !details.lastName.trim()) throw new Error("Ime i prezime su obavezni");
    if (!/^\+?[\d\s\-]{7,15}$/.test(details.phone)) throw new Error("Neispravan broj telefona");
    if (details.postalCode.trim().length < 4) throw new Error("Neispravan poštanski broj");

    await prisma.order.create({
        data: {
            userId: user.id,
            total: computedTotal,
            firstName: details.firstName.trim(),
            lastName: details.lastName.trim(),
            email: details.email.trim().toLowerCase(),
            phone: details.phone.trim(),
            address: details.address.trim(),
            city: details.city.trim(),
            postalCode: details.postalCode.trim(),
            note: details.note?.trim(),
            items: {
                create: cart.items.map((item) => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    price: item.product.salePrice ?? item.product.price,
                })),
            },
        },
    });

    await prisma.cartItem.deleteMany({
        where: {cart: {userId: user.id}},
    });

    revalidatePath("/cart");
}
