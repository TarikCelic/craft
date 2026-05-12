"use client";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {Box, ImageIcon} from "lucide-react";
import {Reveal} from "@/components/ui/Reveal";

type Order = {
    id: number;
    status: string;
    total: number;
    createdAt: string;
    items: {
        product: { name: string };
        variant: {
            images: { url: string }[];
        } | null;
    }[];
    _count: { items: number };
};

type Props = {
    orders: Order[];
};

const STATUS_LABELS: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    SHIPPED: "In Transit",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

const STATUS_WIDTH: Record<string, string> = {
    PENDING: "w-1/4",
    CONFIRMED: "w-2/4",
    SHIPPED: "w-3/4",
    DELIVERED: "w-full",
    CANCELLED: "w-full",
};

export default function AccountOrdersClient({orders}: Props) {
    const router = useRouter();

    if (orders.length === 0) {
        return (
            <div className="min-h-[300px] flex justify-center items-center flex-col gap-4 text-gray-500">
                <Box size={36} strokeWidth={1.5}/>
                <p className="text-lg font-light">You have no orders yet</p>
            </div>
        );
    }

    return (
        <Reveal fade duration={1000} className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8">
                <p className="text-2xl sm:text-3xl font-light">My Orders</p>
                <p className="text-sm sm:text-base font-light text-gray-500 mt-1">
                    Track and view all your orders.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {orders.map((order, i) => {
                    const firstImage = order.items[0]?.variant?.images[0]?.url ?? null;
                    const count = order._count.items;
                    const isCancelled = order.status === "CANCELLED";

                    return (
                        <Reveal
                            delay={i * 150}
                            key={order.id}
                            className="flex overflow-hidden rounded-xl border border-neutral-200 text-neutral-900 text-left transition-all hover:border-neutral-400 hover:shadow-md flex-row sm:flex-col"
                        >

                            <button
                                onClick={() => router.push(`/account/orders/${order.id}`)}
                            >
                                <div
                                    className="relative shrink-0 w-24 h-24 sm:w-full sm:h-auto sm:aspect-square bg-neutral-100">
                                    {firstImage ? (
                                        <Image
                                            src={firstImage}
                                            alt="Product"
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 96px, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div
                                            className="flex h-full w-full items-center justify-center text-neutral-400">
                                            <ImageIcon size={32} strokeWidth={1.5}/>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col justify-center gap-2 p-3 sm:p-4 flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">
                                        {count} {count === 1 ? "item" : "items"} in order
                                    </p>

                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-900/10">
                                        <div
                                            className={[
                                                "h-full rounded-full transition-all",
                                                isCancelled ? "bg-red-400 opacity-50" : "bg-blue-500",
                                                STATUS_WIDTH[order.status] ?? "w-0",
                                            ].join(" ")}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                        <p className="text-xs text-neutral-500 font-light">
                                            {STATUS_LABELS[order.status] ?? order.status}
                                        </p>
                                        <p className="text-xs text-neutral-400 font-light">
                                            {new Date(order.createdAt).toLocaleDateString("en-GB")}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </Reveal>
                    );
                })}
            </div>
        </Reveal>
    );
}