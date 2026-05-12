"use server";

import {revalidatePath} from "next/cache";
import {Prisma, OrderStatus} from "@/app/generated/prisma";
import {prisma} from "@/lib/prisma";
import {getAllowedTransitions} from "@/utils/allowedTransitions";
import {CANCELLED} from "dns";
import {orderInclude, type OrderWithDetails, type RawOrderWithDetails} from "@/types"

function serializeOrder(order: RawOrderWithDetails): OrderWithDetails {
    return {
        ...order,

        total: Number(order.total),

        createdAtFormatted: new Intl.DateTimeFormat("bs-BA", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(order.createdAt),

        items: order.items.map((item) => ({
            ...item,

            price: Number(item.price),

            product: {
                ...item.product,

                price: Number(item.product.price),
            },
        })),
    };
}

export async function getOrders(): Promise<OrderWithDetails[]> {
    const orders = await prisma.order.findMany({
        orderBy: {
            createdAt: "desc",
        },

        include: orderInclude,
    });

    return orders.map(serializeOrder);
}

export async function getOrderById(
    id: number,
): Promise<OrderWithDetails | null> {
    const order = await prisma.order.findUnique({
        where: {
            id,
        },

        include: orderInclude,
    });

    if (!order) return null;

    return serializeOrder(order);
}

type UpdateStatusResult =
    | {
    success: true;
}
    | {
    success: false;
    error: string;
};

export async function updateOrderStatus(
    orderId: number,
    newStatus: OrderStatus,
    cancellationReason?: string,
): Promise<UpdateStatusResult> {
    try {
        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
            },
        });

        if (!order) {
            return {
                success: false,
                error: "Narudžba nije pronađena.",
            };
        }

        const allowed = getAllowedTransitions(order.status);

        if (!allowed.includes(newStatus)) {
            return {
                success: false,
                error: `Nije moguće promijeniti status iz ${order.status} u ${newStatus}.`,
            };
        }

        if (newStatus === "CANCELLED" && !cancellationReason?.trim()) {
            return {
                success: false,
                error: "Razlog otkazivanja je obavezan.",
            };
        }

        await prisma.order.update({
            where: {
                id: orderId,
            },

            data: {
                status: newStatus,
                reasonCanceled: cancellationReason,
            },
        });

        const NOTIFICATIONS_TYPE: Record<string, string> = {
            CONFIRMED: "confirmed",
            SHIPPED: "shipped",
            DELIVERED: "delivered",
            CANCELLED: "canceled",
        };

        await prisma.notification.create({
            data: {
                userId: order.userId,
                title: "Order Update",
                message: `Your order #${order.id} is ${NOTIFICATIONS_TYPE[newStatus]}. You can follow it on account/orders/${orderId}`,
            },
        });

        revalidatePath("/admin/orders");

        return {
            success: true,
        };
    } catch (err) {
        console.error(err);

        return {
            success: false,
            error: "Greška pri ažuriranju narudžbe.",
        };
    }
}
