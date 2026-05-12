"use client";

import {useEffect} from "react";
import Link from "next/link";
import {X} from "lucide-react";
import Logo from "../ui/Logo";
import NavLinks from "./NavLinks";
import NavIcons from "./NavIcons";

type Props = {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    isDark: boolean;
    onSearchClick: () => void;
};

export default function MobileMenu({
                                       isOpen,
                                       setIsOpen,
                                       isDark,
                                       onSearchClick,
                                   }: Props) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleSearchClick = () => {
        setIsOpen(false);
        onSearchClick();
    };

    return (
        <>
            <div
                className={`fixed inset-0 z-[60] bg-neutral-900/60 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsOpen(false)}
            />

            <aside
                className={`fixed top-0 right-0 z-[70] h-full w-[300px] max-w-[85vw] transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                } ${isDark ? "bg-[#11141b] text-white" : "bg-white text-neutral-900"}`}
            >
                <div className="flex flex-col h-full p-8">
                    <div className="flex items-center justify-between mb-12">
                        <Link href="/" onClick={() => setIsOpen(false)}>
                            <Logo/>
                        </Link>
                        <button
                            onClick={() => setIsOpen(false)}
                            className={`p-2 rounded-full transition-colors ${
                                isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                            }`}
                            aria-label="Close menu"
                        >
                            <X size={28}/>
                        </button>
                    </div>

                    <NavLinks isDark={isDark} onClick={() => setIsOpen(false)}/>

                    <div className="mt-auto pt-10">
                        <div
                            className={`h-px my-4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
                        />
                        <NavIcons
                            isDark={isDark}
                            hideSearchIcon
                            isOpened={isOpen}
                            onSearchClick={handleSearchClick}
                            onClick={() => setIsOpen(false)}
                        />
                    </div>
                </div>
            </aside>
        </>
    );
}
