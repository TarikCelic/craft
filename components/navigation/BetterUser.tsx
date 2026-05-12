"use client";
import {useSession} from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {User} from "lucide-react";

export default function BUser() {
    const {data: session, status} = useSession();

    if (status === "loading")
        return <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse"/>;

    if (!session?.user) {
        return (
            <Link
                href="/account"
                className={`relative p-2 rounded-md transition-all duration-200 hover:bg-(--mainTransparentLink) hover:text-blue-600`}
            >
                <User size={22}/>
            </Link>
        );
    }

    const {name, email, image} = session.user;

    return (
        <Link
            href="/account"
            className="flex gap-2 items-center lg:ml-2 lg:pl-4 lg:rounded-full lg:bg-neutral-900/2 lg:border lg:border-neutral-900/3"
        >
            <div className="hidden lg:block text-right flex items-center justify-center flex-col">
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className={`text-xs font-light leading-none`}>{email}</p>
            </div>
            {image ? (
                <div className="w-10 h-10 relative border-1 border-neutral-900/3 rounded-full">
                    <Image
                        src={image}
                        alt="Profile"
                        fill
                        className="object-cover rounded-full"
                    />
                </div>
            ) : (
                <div
                    className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-sm font-bold text-white">
                    <User size={15}/>
                </div>
            )}
        </Link>
    );
}