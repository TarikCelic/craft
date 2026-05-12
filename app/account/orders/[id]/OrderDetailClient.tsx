"use client";

import {useEffect, useState, useTransition} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {ImageIcon, X} from "lucide-react";
import {cancelOrder, removeOrderItem} from "@/data/account/orders/actions";
import Link from "next/link";
import {Reveal} from "@/components/ui/Reveal";

type OrderItem = {
    id: number;
    quantity: number;
    price: number;
    product: { id: number; name: string; price: number };
    variant: {
        id: number;
        color: string;
        images: { id: number; url: string; order: number }[];
    } | null;
};

type Order = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    note: string | null;
    status: string;
    total: number;
    createdAt: string;
    reasonCanceled?: string | null;
    items: OrderItem[];
};

const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    CONFIRMED: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    SHIPPED: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    DELIVERED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    CANCELLED: "bg-red-500/15 text-red-400 border-red-500/30",
};

const STATUS_WIDTH: Record<string, string> = {
    PENDING: "w-1/4",
    CONFIRMED: "w-2/4",
    SHIPPED: "w-3/4",
    DELIVERED: "w-full",
    CANCELLED: "w-full",
};

const STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"] as const;

const STATUS_LABELS: Record<string, string> = {
    PENDING: "Na čekanju",
    CONFIRMED: "Potvrđena",
    SHIPPED: "U transportu",
    DELIVERED: "Dostavljeno",
    CANCELLED: "Otkazano",
};

function OrderStatusBar({status, reasonCanceled}: { status: string; reasonCanceled?: string | null }) {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const raf = requestAnimationFrame(() => setAnimated(true));
        return () => cancelAnimationFrame(raf);
    }, []);

    if (status === "CANCELLED") {
        return (
            <div className="flex items-center gap-2 rounded-sm border border-red-200 bg-red-50 px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-red-400"/>
                <span className="text-xs font-medium text-red-500">
                    Otkazano - <span>{reasonCanceled}</span>
                </span>
            </div>
        );
    }

    const currentIndex = STATUSES.indexOf(status as (typeof STATUSES)[number]);
    const progress = ((currentIndex + 1) / STATUSES.length) * 100;

    return (
        <div className="space-y-1.5">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-neutral-900/10">
                <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-700 ease-out"
                    style={{width: animated ? `${progress}%` : "0%"}}
                />
            </div>
            <div className="flex justify-between">
                {STATUSES.map((s, i) => (
                    <span
                        key={s}
                        className={[
                            "text-[10px] font-medium transition-colors",
                            i <= currentIndex ? "text-blue-600" : "text-neutral-900/30",
                        ].join(" ")}
                    >
                        {STATUS_LABELS[s]}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function OrderDetailClient({order}: { order: Order }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const isPendingOrder = order.status === "PENDING";

    function handleCancel() {
        if (!confirm("Jeste li sigurni da želite otkazati narudžbu?")) return;
        startTransition(async () => {
            const result = await cancelOrder(order.id);
            if (result.success) {
                router.push("/account/orders");
            } else {
                alert(result.error);
            }
        });
    }

    function handleRemoveItem(itemId: number) {
        startTransition(async () => {
            const result = await removeOrderItem(order.id, itemId);
            if (!result.success) alert(result.error);
        });
    }

    return (
        <div className="space-y-6 px-4 py-8">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <p className="font-mono text-xs text-neutral-900/40">
                        #{String(order.id).padStart(6, "0")}
                    </p>
                    <p className="text-xs text-neutral-900/40">{order.createdAt}</p>
                </div>
                <OrderStatusBar status={order.status} reasonCanceled={order.reasonCanceled}/>
            </div>

            <Reveal fade duration={1000}
                    className="rounded-xl border border-neutral-900/5 bg-white-900/50 p-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-900-500">
                    Podaci o dostavi
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm mt-4">
                    <div>
                        <p className="font-mono uppercase text-xs font-bold text-blue-600">Ime i prezime</p>
                        <p className="text-neutral-900-200">{order.firstName} {order.lastName}</p>
                    </div>
                    <div>
                        <p className="font-mono uppercase text-xs font-bold text-blue-600">Email</p>
                        <p className="text-neutral-900-200">{order.email}</p>
                    </div>
                    <div>
                        <p className="font-mono uppercase text-xs font-bold text-blue-600">Telefon</p>
                        <p className="text-neutral-900-200">{order.phone}</p>
                    </div>
                    <div>
                        <p className="font-mono uppercase text-xs font-bold text-blue-600">Adresa</p>
                        <p className="text-neutral-900-200">{order.address}, {order.postalCode} {order.city}</p>
                    </div>
                </div>
                {order.note && (
                    <div className="rounded-lg border border-blue-200 bg-blue-500/5 px-3 py-2">
                        <p className="text-xs font-medium text-blue-600">Napomena</p>
                        <p className="mt-0.5 text-sm text-neutral-900">{order.note}</p>
                    </div>
                )}
            </Reveal>

            <Reveal fade duration={1000} className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-900-500">
                    Stavke narudžbe
                </p>
                {order.items.map((item, i) => {
                    const image = item.variant?.images[0]?.url ?? null;
                    return (
                        <Link href={`/shop/${item.product.id}`} key={item.id}>
                            <Reveal direction={"fromDown"} delay={i * 150}
                                    className="flex items-center gap-4 rounded-xl border border-neutral-900/5 bg-white-900/50 p-4">
                                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white-800">
                                    {image ? (
                                        <Image
                                            src={image}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    ) : (
                                        <div
                                            className="flex h-full w-full items-center justify-center text-neutral-400">
                                            <ImageIcon size={20} strokeWidth={1.5}/>
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-neutral-900-200">
                                        {item.product.name}
                                    </p>
                                    {item.variant && (
                                        <div className="mt-0.5 flex items-center gap-1.5">
                                            <div
                                                className="h-3 w-3 rounded-full border border-neutral-700"
                                                style={{backgroundColor: item.variant.color}}
                                            />
                                        </div>
                                    )}
                                    <p className="mt-1 text-xs text-neutral-900-500">×{item.quantity}</p>
                                </div>

                                <div className="flex shrink-0 flex-col items-end gap-2">
                                    <p className="text-sm font-semibold text-neutral-900">
                                        {Number(item.price).toFixed(2)} KM
                                    </p>
                                    {isPendingOrder && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleRemoveItem(item.id);
                                            }}
                                            disabled={isPending}
                                            className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-700 text-neutral-900-500 transition-colors hover:border-red-500/50 hover:text-red-400 disabled:opacity-40"
                                        >
                                            <X size={12} strokeWidth={2}/>
                                        </button>
                                    )}
                                </div>
                            </Reveal>
                        </Link>
                    );
                })}
            </Reveal>

            <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
                <div>
                    {isPendingOrder && (
                        <button
                            onClick={handleCancel}
                            disabled={isPending}
                            className="text-sm text-red-400 underline-offset-2 hover:underline disabled:opacity-40"
                        >
                            Otkaži narudžbu
                        </button>
                    )}
                </div>
                <p className="text-base font-semibold text-neutral-900-100">
                    Ukupno: {Number(order.total).toFixed(2)} KM
                </p>
            </div>
        </div>
    );
}