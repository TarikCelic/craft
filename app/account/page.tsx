import {
    getLatestOrder,
    recentNotifications,
} from "@/data/account/layout/actions";
import getUser from "@/utils/getUser";
import Image from "next/image";
import Link from "next/link";
import {redirect} from "next/navigation";
import {countFavourited} from "@/data/shop/actions";
import {Bell, Box, Heart, MessageCircle} from "lucide-react";
import {Reveal} from "@/components/ui/Reveal";

const STATUSES: Record<string, string> = {
    PENDING: "Na čekanju",
    CONFIRMED: "Potvrđena",
    SHIPPED: "U transportu",
    DELIVERED: "Dostavljeno",
    CANCELLED: "Otkazano",
};

const STATUS_WIDTH: Record<string, string> = {
    PENDING: "10%",
    CONFIRMED: "30%",
    SHIPPED: "75%",
    DELIVERED: "100%",
    CANCELLED: "w-full",
};

export default async function AccountPage() {
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    const favouritedCount = await countFavourited(user.id);
    const lOrder = await getLatestOrder(user.id);

    const messages = (await recentNotifications(user.id)) ?? [];

    return (
        <div className="grid grid-cols-12 gap-4 mx-4 lg:h-[calc(100dvh-380px)] min-h-[600px]">
            {lOrder?.count! === 0 ||
                (!lOrder.count && (
                    <Reveal direction={"fromLeft"}
                            className=" col-span-12 lg:col-span-7 bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-neutral-100 dark:border-zinc-800 p-6 flex flex-col shadow-sm h-full">
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 px-2 shrink-0">
                            Latest Order
                        </h2>
                        <div
                            className="h-full w-full border border-dotted border-neutral-200  text-gray-700 flex flex-col justify-center gap-4 items-center col-span-12 lg:col-span-7 bg-neutral-100 rounded-3xl">
                            <Box size={50}/>
                            <p>There's no recent orders.</p>
                        </div>
                    </Reveal>
                ))}
            {lOrder?.count! > 0 && (
                <Reveal direction={"fromLeft"}
                        className=" col-span-12 lg:col-span-7 bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-neutral-100 dark:border-zinc-800 p-6 flex flex-col shadow-sm h-full">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 px-2 shrink-0">
                        Latest Order
                    </h2>

                    <>
                        <Link
                            href={`/account/orders/${lOrder.id}`}
                            className="relative w-full flex-1 min-h-[400px] rounded-3xl overflow-hidden mb-6"
                        >
                            <Image
                                src={lOrder?.items?.[0]?.variant?.images?.[0]?.url!}
                                alt="Product"
                                fill
                                className="object-cover"
                            />
                        </Link>

                        <div className="px-2 space-y-4 shrink-0">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                                    {lOrder.count}{" "}
                                    {lOrder.count! > 1 ? " proizvoda" : " proizvod"} u narudzbi
                                </h3>
                                <span className="text-sm font-bold text-blue-500 uppercase tracking-wider">
                  {lOrder?.status ? STATUSES[lOrder.status] : null}
                </span>
                            </div>

                            <div className="space-y-2">
                                <div
                                    className="h-2 w-full bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 dark:bg-neutral-100 rounded-full"
                                        style={{
                                            width: lOrder?.status
                                                ? STATUS_WIDTH[lOrder.status]
                                                : "0%",
                                        }}
                                    />
                                </div>
                                <div
                                    className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
                                    <span>Na cekanju</span>
                                    <span>Dostavljeno</span>
                                </div>
                            </div>
                        </div>
                    </>
                </Reveal>
            )}
            <Reveal direction={"fromRight"} className="  col-span-12 lg:col-span-5 flex flex-col gap-4 h-full">
                <div
                    className="bg-white dark:bg-zinc-950 rounded-3xl border border-neutral-100 dark:border-zinc-800 p-5 flex items-center justify-between group  transition-all shadow-sm shrink-0">
                    <Link href={"account/favourites"} className="flex items-center gap-4">
                        <div
                            className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-500">
                            <Heart size={22} className="fill-rose-500"/>
                        </div>
                        {favouritedCount === 0 && (
                            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 leading-tight">
                                You have no products in your wishlist
                            </p>
                        )}
                        {favouritedCount > 0 && (
                            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 leading-tight">
                                You have{" "}
                                <span className="font-bold text-neutral-900 dark:text-neutral-100">
                  {favouritedCount}{" "}
                                    {favouritedCount > 1 ? "products" : "product"}
                </span>{" "}
                                in favourites
                            </p>
                        )}
                    </Link>
                </div>

                <div
                    className="bg-white dark:bg-zinc-950 rounded-3xl border border-neutral-100 dark:border-zinc-800 p-6 flex flex-col shadow-sm flex-1 min-h-0">
                    <div className="flex justify-between items-center mb-4 shrink-0">
                        <h2 className="text-md font-bold text-neutral-900 dark:text-neutral-100">
                            Recent Notifications
                        </h2>
                    </div>

                    <div className="space-y-3 overflow-y-auto pr-2 scrollbar-hide">
                        {messages.length < 1 && (
                            <div
                                className="h-full justify-center items-center py-30 bg-neutral-100 border border-dotted border-neutral-200 rounded-3xl flex flex-col gap-4 text-gray-700">
                                <Bell size={50}/>
                                <p>There's no notifications yet.</p>
                            </div>
                        )}
                        {messages.map((e, i) => (
                            <Reveal
                                delay={i * 200}
                                key={e.id}
                                fade
                                className="p-4 rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-200 relative cursor-pointer hover:bg-neutral-100 duration-200 transition-all"
                            >
                                {!e.read && (
                                    <span
                                        className="absolute right-4 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    NEW
                  </span>
                                )}
                                <p className=" text-neutral-900 font-bold dark:text-neutral-300 leading-snug">
                                    {e.title}
                                </p>
                                <p className="text-[0.8rem] text-neutral-600">
                                    {e.message.trim().split(" ").slice(0, 5).join(" ")}....
                                </p>
                            </Reveal>
                        ))}
                    </div>
                </div>

                <Link href={"/contact"}
                      className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-2xl py-4 px-6 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all font-bold text-sm shadow-sm shrink-0">
                    <MessageCircle size={18} strokeWidth={2.5}/>
                    Need help? Contact us
                </Link>
            </Reveal>
        </div>
    );
}
