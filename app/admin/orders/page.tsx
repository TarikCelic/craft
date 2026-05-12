import {getOrders} from "@/data/admin/orders/actions";
import {OrdersTable} from "./orders-table";
import {Reveal} from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
    const orders = await getOrders();

    const counts = {
        total: orders.length,
        pending: orders.filter((o) => o.status === "PENDING").length,
        confirmed: orders.filter((o) => o.status === "CONFIRMED").length,
        shipped: orders.filter((o) => o.status === "SHIPPED").length,
        delivered: orders.filter((o) => o.status === "DELIVERED").length,
        cancelled: orders.filter((o) => o.status === "CANCELLED").length,
    };

    return (
        <Reveal fade duration={1000} className="min-h-screen text-neutral-100">
            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
                        Orders
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        Overview and management of all orders.
                    </p>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {[
                        {label: "Total", value: counts.total, color: "text-neutral-200"},
                        {
                            label: "Pending",
                            value: counts.pending,
                            color: "text-amber-400",
                        },
                        {
                            label: "Confirmed",
                            value: counts.confirmed,
                            color: "text-blue-400",
                        },
                        {
                            label: "In Transit",
                            value: counts.shipped,
                            color: "text-violet-400",
                        },
                        {
                            label: "Delivered",
                            value: counts.delivered,
                            color: "text-emerald-400",
                        },
                        {
                            label: "Cancelled",
                            value: counts.cancelled,
                            color: "text-red-400",
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-lg border border-blue-900 bg-blue-900/15 px-4 py-3"
                        >
                            <p className="text-xs text-neutral-500">{stat.label}</p>
                            <p
                                className={[
                                    "mt-1 text-2xl font-bold tabular-nums",
                                    stat.color,
                                ].join(" ")}
                            >
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>
                <OrdersTable orders={orders}/>
            </div>
        </Reveal>
    );
}