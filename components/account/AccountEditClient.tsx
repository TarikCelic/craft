"use client";
import {useState} from "react";
import {Edit} from "lucide-react";
import EditProfileModal from "@/components/account/EditProfileModal";

interface AccountEditClientProps {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export default function AccountEditClient({user}: AccountEditClientProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                aria-label="Edit Account"
                className="flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto rounded-full border border-neutral-900 bg-white text-neutral-900 text-xs sm:text-sm font-medium transition-all hover:bg-neutral-900 hover:text-white cursor-pointer"
            >
                <Edit size={15}/>
                Edit Account
            </button>
            <EditProfileModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                user={user}
            />
        </>
    );
}