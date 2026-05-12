import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/navigation/Navigation";
import {User} from "lucide-react";
import getUser from "@/utils/getUser";
import {redirect} from "next/navigation";
import {LogoutButton} from "@/components/ui/LogoutButton";
import {CartInitializer} from "@/components/navigation/CartInitializer";
import {getCartCount} from "@/data/shop/getCartCount";
import {getLatestOrder} from "@/data/account/layout/actions";
import AccountEditClient from "@/components/account/AccountEditClient";
import {Reveal} from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

export default async function AccountLayout({children}: { children: React.ReactNode }) {
    const user = await getUser();

    if (!user) redirect("/login");

    const lOrder = getLatestOrder(user.id);
    const cartCount = await getCartCount();

    return (
        <div className="max-w-7xl mx-auto w-full min-h-screen pb-8">
            <CartInitializer count={cartCount}/>
            <Navigation/>

            <Reveal fade duration={1000}
                    className=" mx-3 sm:mx-4 mt-4 sm:mt-6 bg-white dark:bg-zinc-950 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-neutral-100 dark:border-zinc-800">
                <div className="flex flex-row items-center justify-between gap-3">

                    <div className="flex items-center gap-3 min-w-0">
                        <div
                            className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-neutral-900 text-white">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt="Profile Picture"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <User size={20}/>
                            )}
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                            <h1 className="text-base sm:text-xl md:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight truncate">
                                {user.name}
                            </h1>
                            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col  gap-2 shrink-0 ">
                        <AccountEditClient user={user}/>
                        <LogoutButton/>
                    </div>
                </div>
            </Reveal>

            <div
                className="flex flex-row items-center gap-4 px-6 py-4  ">
                {[
                    {href: "/account/notifications", label: "Notifications"},
                    {href: "/account/orders", label: "Orders"},
                    {href: "/account/favourites", label: "Favourites"},
                ].map(({href, label}, i) => (
                    <Reveal
                        className={""}
                        delay={i * 150}
                        key={href}>
                        <Link
                            href={href}
                            className="pb-3 sm:pb-4 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors whitespace-nowrap border-b-2 border-transparent hover:border-neutral-300 dark:hover:border-zinc-600"
                        >
                            {label}
                        </Link>
                    </Reveal>
                ))}
            </div>

            <main className="w-full mt-2">
                {children}
            </main>
        </div>
    );
}