"use client";

import Image from "next/image";
import {OrderStatus} from "@/app/generated/prisma";
import {updateOrderStatus} from "@/data/admin/orders/actions";
import {getAllowedTransitions} from "@/utils/allowedTransitions";
import {ManageDialog} from "./manage-dialog";
import type {OrderWithDetails} from "@/types";
import {ImageIcon} from "lucide-react";

const STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    SHIPPED: "In Transit",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
    PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    CONFIRMED: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    SHIPPED: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    DELIVERED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    CANCELLED: "bg-red-500/15 text-red-400 border-red-500/30",
};

const TRANSITION_COLORS: Record<OrderStatus, string> = {
    PENDING: "border-amber-500/40 text-amber-300 hover:bg-amber-500/10",
    CONFIRMED: "border-blue-500/40 text-blue-300 hover:bg-blue-500/10",
    SHIPPED: "border-violet-500/40 text-violet-300 hover:bg-violet-500/10",
    DELIVERED: "border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10",
    CANCELLED: "border-red-500/40 text-red-300 hover:bg-red-500/10",
};

type Props = {
    order: OrderWithDetails;
    onClose: () => void;
};

export function ManageOrderDialog({order, onClose}: Props) {
    const allowedTransitions = getAllowedTransitions(order.status);

    const items = (
        <div className="flex flex-col gap-3">
            {order.items.map((item) => {
                const previewImage = item.variant?.images?.[0]?.url ?? null;
                return (
                    <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900/40 p-3"
                    >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-neutral-800">
                            {previewImage ? (
                                <Image
                                    src={previewImage}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                    sizes="56px"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-neutral-600">
                                    <ImageIcon size={20} strokeWidth={1.5}/>
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-neutral-200">
                                {item.product.name}
                            </p>
                            {item.variant && (
                                <div className="mt-0.5 flex items-center gap-1.5">
                                    <div
                                        className="h-3 w-3 rounded-full border border-neutral-700"
                                        style={{backgroundColor: item.variant.color}}
                                    />
                                    <span className="text-xs text-neutral-500">
                    {item.variant.color}
                  </span>
                                </div>
                            )}
                        </div>
                        <div className="shrink-0 text-right">
                            <p className="text-xs text-neutral-500">×{item.quantity}</p>
                            <p className="text-sm font-semibold text-neutral-200">
                                {Number(item.price).toFixed(2)} KM
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <ManageDialog
            id={order.id}
            title="Manage Order"
            currentStatus={order.status}
            statusLabel={STATUS_LABELS[order.status]}
            statusColorClass={STATUS_COLORS[order.status]}
            isFinal={allowedTransitions.length === 0}
            actions={allowedTransitions.map((status) => ({
                status,
                label: STATUS_LABELS[status],
                colorClass: TRANSITION_COLORS[status],
            }))}
            requiresReason={(status) => status === "CANCELLED"}
            reasonPlaceholder="Enter the reason for cancelling the order..."
            sections={[
                {
                    title: "Customer Information",
                    fields: [
                        {
                            label: "Full Name",
                            value: `${order.firstName} ${order.lastName}`,
                        },
                        {label: "Email", value: order.email},
                        {label: "Phone", value: order.phone},
                    ],
                },
                {
                    title: "Shipping Address",
                    fields: [
                        {label: "Street Address", value: order.address},
                        {label: "City", value: order.city},
                        {label: "Postal Code", value: order.postalCode},
                    ],
                    extra: order.note ? (
                        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
                            <p className="text-xs font-medium text-amber-400/80">
                                Customer Note
                            </p>
                            <p className="mt-0.5 text-sm text-amber-300/90">{order.note}</p>
                        </div>
                    ) : undefined,
                },
                {
                    title: "Order Details",
                    fields: [
                        {label: "Date", value: order.createdAtFormatted},
                        {
                            label: "Total",
                            value: (
                                <span className="font-semibold text-neutral-100">
                  {Number(order.total).toFixed(2)} KM
                </span>
                            ),
                        },
                    ],
                },
            ]}
            items={items}
            onSubmit={async (status, reason) =>
                updateOrderStatus(order.id, status, reason)
            }
            onClose={onClose}
        />
    );
}