"use client";

import {useState} from "react";
import {OrderStatus} from "@/app/generated/prisma";
import {DataTable, ColumnDef} from "@/components/admin/data-table";
import {ManageOrderDialog} from "@/components/admin/manage-order-dialog";
import type {OrderWithDetails} from "@/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING: "Na čekanju",
    CONFIRMED: "Potvrđena",
    SHIPPED: "U transportu",
    DELIVERED: "Dostavljeno",
    CANCELLED: "Otkazano",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
    PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    CONFIRMED: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    SHIPPED: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    DELIVERED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    CANCELLED: "bg-red-500/15 text-red-400 border-red-500/30",
};

type Props = {
    orders: OrderWithDetails[];
};

export function OrdersTable({orders}: Props) {
    const [managingOrder, setManagingOrder] = useState<OrderWithDetails | null>(
        null,
    );

    const columns: ColumnDef<OrderWithDetails>[] = [
        {
            key: "id",
            header: "ID",
            cell: (row) => (
                <span className="font-mono text-xs text-neutral-400">
          #{String(row.id).padStart(6, "0")}
        </span>
            ),
        },
        {
            key: "customer",
            header: "Kupac",
            cell: (row) => (
                <div className="space-y-0.5">
                    <p className="font-medium text-neutral-200">
                        {row.firstName} {row.lastName}
                    </p>
                    <p className="text-xs text-neutral-500">{row.email}</p>
                    <p className="text-xs text-neutral-500">{row.phone}</p>
                </div>
            ),
        },
        {
            key: "items",
            header: "Stavke",
            cell: (row) => (
                <span className="text-neutral-400">
          {row.items.length} {row.items.length === 1 ? "stavka" : "stavki"}
        </span>
            ),
        },
        {
            key: "total",
            header: "Ukupno",
            cell: (row) => (
                <span className="font-semibold text-neutral-100">
          {Number(row.total).toFixed(2)} KM
        </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            cell: (row) => (
                <span
                    className={[
                        "inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-medium",
                        STATUS_COLORS[row.status],
                    ].join(" ")}
                >
          {STATUS_LABELS[row.status]}
        </span>
            ),
        },
        {
            key: "date",
            header: "Datum",
            cell: (row) => (
                <span className="text-neutral-400">{row.createdAtFormatted}</span>
            ),
        },
        {
            key: "actions",
            header: "",
            cell: (row) => (
                <button
                    onClick={() => setManagingOrder(row)}
                    className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-all hover:border-neutral-500 hover:bg-neutral-800 hover:text-neutral-100"
                >
                    Upravljaj
                </button>
            ),
            className: "text-right",
        },
    ];

    return (
        <>
            <DataTable
                data={orders}
                columns={columns}
                keyExtractor={(row) => row.id}
                emptyMessage="Nema narudžbi."
            />

            {managingOrder && (
                <ManageOrderDialog
                    order={managingOrder}
                    onClose={() => setManagingOrder(null)}
                />
            )}
        </>
    );
}
