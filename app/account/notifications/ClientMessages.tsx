"use client";

import {updateReadStatus} from "@/data/account/notifications/actions";
import {Bell, Box, LucideMessageCircleWarning, X} from "lucide-react";
import {useState} from "react";
import {Reveal} from "@/components/ui/Reveal";

type Notification = {
    id: number;
    title: string;
    message: string;
    read: boolean;
    userId: string;
    createdAt: Date;
};

type messagesProps = {
    messages: Notification[];
};

function getNotificationStyle(title: string) {
    const t = title.toLowerCase();
    if (t.includes("order")) return {
        icon: <Box size={20}/>,
        color: "bg-emerald-500/20 text-emerald-600",
    };
    if (t.includes("admin")) return {
        icon: <LucideMessageCircleWarning size={20}/>,
        color: "bg-red-500/20 text-red-600",
    };
    return {
        icon: <Bell size={20}/>,
        color: "bg-blue-500/20 text-blue-600",
    };
}

export default function ClientMessages({messages}: messagesProps) {
    const [selected, setSelected] = useState<Notification | null>(null);

    if (messages.length === 0) {
        return (
            <div className="min-h-[300px] flex justify-center items-center flex-col gap-4 text-gray-500">
                <Bell size={36}/>
                <p className="text-lg font-light">You have no notifications</p>
            </div>
        );
    }

    return (
        <Reveal duration={1000} fade className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto ">
            <div className="mb-6 sm:mb-8">
                <p className="text-2xl sm:text-3xl font-light">Notifications Center</p>
                <p className="text-sm sm:text-base font-light text-gray-500 mt-1">
                    Here you can view all notifications.
                </p>
            </div>

            <div className="space-y-2">
                {messages.map((e, i) => {
                    const style = getNotificationStyle(e.title);
                    return (
                        <Reveal
                            delay={i * 150}
                            key={e.id}


                        >
                            <div
                                className={` p-3 sm:p-4 border border-neutral-900/10 rounded-lg flex gap-3 items-center cursor-pointer transition-all duration-200 hover:scale-[1.01] ${
                                    e.read
                                        ? "bg-neutral-900/5 hover:bg-neutral-900/5"
                                        : "hover:bg-neutral-900/3"
                                }`} onClick={() => {
                                setSelected(e);
                                if (!e.read) updateReadStatus(e.id);
                            }}>

                                <div className={`shrink-0 p-2 rounded-md ${style.color}`}>
                                    {style.icon}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-sm sm:text-base truncate">{e.title}</p>
                                    <p className="font-light text-gray-500 text-xs sm:text-sm truncate">
                                        {e.message.trim().split(" ").slice(0, 5).join(" ")}...
                                    </p>
                                </div>
                                <p className="shrink-0 text-xs text-gray-400 hidden sm:block">
                                    {new Date(e.createdAt).toLocaleDateString("bs-BA")}
                                </p>
                            </div>
                        </Reveal>
                    );
                })}
            </div>

            {selected && (() => {
                const style = getNotificationStyle(selected.title);
                return (
                    <div
                        className="fixed inset-0 bg-neutral-900/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
                        onClick={() => setSelected(null)}
                    >
                        <div
                            className="bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-2xl p-5 sm:p-6 shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-10 h-1 bg-neutral-200 rounded-full mx-auto mb-4 sm:hidden"/>

                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`shrink-0 p-2 rounded-md ${style.color}`}>
                                        {style.icon}
                                    </div>
                                    <p className="font-bold text-base sm:text-lg leading-tight">
                                        {selected.title}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelected(null)}
                                    className="shrink-0 p-1.5 rounded-md hover:bg-neutral-900/5 transition-all cursor-pointer"
                                >
                                    <X size={18}/>
                                </button>
                            </div>

                            <p className="text-gray-700 font-light leading-relaxed text-sm sm:text-base">
                                {selected.message}
                            </p>

                            <p className="text-xs text-gray-400 mt-4">
                                {new Date(selected.createdAt).toLocaleString("bs-BA", {
                                    dateStyle: "long",
                                    timeStyle: "short",
                                })}
                            </p>
                        </div>
                    </div>
                );
            })()}
        </Reveal>
    );
}