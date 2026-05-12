import {prisma} from "@/lib/prisma";
import getUser from "@/utils/getUser";
import {redirect} from "next/navigation";
import CartClient from "./CartClient";

export default async function Page() {
    const user = await getUser();

    if (!user) redirect("/login");

    const cart = await prisma.cart.findUnique({
        where: {userId: user.id},
        include: {
            items: {
                include: {product: true, variant: {include: {images: true}}},
            },
        },
    });

    const serializedCart = cart
        ? {
            ...cart,
            items: cart.items.map((item) => ({
                ...item,
                product: {
                    ...item.product,
                    price: Number(item.product.price),
                    salePrice: item.product.salePrice ? Number(item.product.salePrice) : null,
                },
            })),
        }
        : null;

    return <CartClient cart={serializedCart}/>;
}
