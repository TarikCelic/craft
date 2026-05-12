"use client";
import {LogOut} from "lucide-react";
import {signOut} from "next-auth/react";
import {toast} from "sonner";

export function LogoutButton() {
    const handleLogout = async () => {
        await signOut({redirect: false});
        toast.success("Successfully logged out.");
        setTimeout(() => {
            window.location.href = "/";
        }, 1500);
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto rounded-full border border-neutral-900 bg-white text-neutral-900 text-xs sm:text-sm font-medium transition-all hover:bg-neutral-900 hover:text-white cursor-pointer"
        >
            <LogOut size={15}/>
            Log Out
        </button>
    );
}