"use client";

import {useState, useEffect} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";
import Logo from "../ui/Logo";
import {Menu, Search, X} from "lucide-react";
import NavLinks from "./NavLinks";
import NavIcons from "./NavIcons";
import SearchSection from "./SearchSection";
import MobileMenu from "./MobileMenu";
import type {Category} from "@/app/generated/prisma/client";
import {Reveal} from "@/components/ui/Reveal";

export type SerializedImage = {
    id: number;
    url: string;
    order: number;
    variantId: number;
};

export type SerializedVariant = {
    id: number;
    color: string;
    productId: number;
    images: SerializedImage[];
};

export type SerializedProduct = {
    id: number;
    name: string;
    description: string | null;
    dimensions: string | null;
    price: number;
    createdAt: string;
    category: Category;
    materials: string[];
    variants: SerializedVariant[];
};

type NavigationProps = {
    className?: string;
    variant?: "light" | "dark";
    showSearch?: boolean;
};

export default function Navigation({
                                       className,
                                       variant = "light",
                                       showSearch = false,
                                   }: NavigationProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchPanelOpen, setSearchPanelOpen] = useState(false);

    const isAdminRoute = pathname?.startsWith("/admin");
    const isDark = isAdminRoute || variant === "dark";

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setMobileMenuOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setSearchPanelOpen(false);
    }, [pathname]);

    const navBg = isAdminRoute
        ? "bg-[#0d0f14] border-gray-800 text-white"
        : isDark
            ? "bg-[#13161e]/80 border-white/[0.06] text-[#e8eaf0] backdrop-blur-md"
            : "bg-white/80 border-gray-100 text-neutral-900 backdrop-blur-md";

    const openSearch = () => setSearchPanelOpen((e) => !e);
    const closeSearch = () => setSearchPanelOpen(false);

    return (
        <>
            <Reveal direction="fromUp">
                <nav
                    className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${navBg} ${className}`}
                >
                    <div className="flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 gap-4">
                        <div className="flex items-center gap-6 lg:gap-10 shrink-0">
                            <Link
                                href="/"
                                className={`inline-block transition-opacity hover:opacity-70 ${
                                    isAdminRoute ? "invert" : ""
                                }`}
                            >
                                <Logo/>
                            </Link>
                            <div className="hidden md:block">
                                <NavLinks isDark={isDark}/>
                            </div>
                        </div>

                        {showSearch && (
                            <div className="hidden min-[900px]:flex flex-1 mx-4">
                                <SearchSection isDark={isDark}/>
                            </div>
                        )}

                        <div className="flex items-center gap-2 shrink-0">
                            <div className="hidden md:flex">
                                <NavIcons
                                    isDark={isDark}
                                    isOpened={searchPanelOpen}
                                    hideSearchIcon={showSearch}
                                    onSearchClick={openSearch}
                                />
                            </div>

                            <button
                                className="md:hidden p-2 rounded-md transition-colors"
                                onClick={() => setSearchPanelOpen((v) => !v)}
                                aria-label="Toggle search"
                            >
                                {searchPanelOpen ? <X size={22}/> : <Search size={22}/>}
                            </button>

                            <button
                                className="md:hidden p-2 rounded-md transition-colors"
                                onClick={() => setMobileMenuOpen(true)}
                                aria-label="Open menu"
                            >
                                <Menu size={28}/>
                            </button>
                        </div>
                    </div>

                    {searchPanelOpen && (
                        <div
                            className={`w-full border-t px-4 py-3 ${
                                isDark ? "border-white/10" : "border-gray-200"
                            }`}
                        >
                            <div className={showSearch ? "min-[900px]:hidden" : ""}>
                                <SearchSection isDark={isDark} onResultClick={closeSearch}/>
                            </div>
                        </div>
                    )}
                </nav>
            </Reveal>

            <MobileMenu
                isOpen={mobileMenuOpen}
                setIsOpen={setMobileMenuOpen}
                isDark={isDark}
                onSearchClick={openSearch}
            />
        </>
    );
}