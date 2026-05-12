"use client";
import {useState, useRef, useEffect} from "react";
import ProductCard from "@/components/shop/ProductCard";
import FilterSidebar from "@/components/shop/FilterSidebar";
import Navigation from "@/components/navigation/Navigation";
import {SlidersHorizontal} from "lucide-react";

import {ProductWithVariantsSerialized} from "@/types";

import {ChevronsUpDown, X} from "lucide-react";
import {Reveal} from "@/components/ui/Reveal";
import {useRouter, useSearchParams} from "next/navigation";

function MobileDrawer({
                          open,
                          onClose,
                      }: {
    open: boolean;
    onClose: () => void;
}) {
    return (
        <>
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-neutral-900/40 z-40 lg:hidden transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            />
            <div
                className={`fixed top-0 left-0 h-full w-[300px] bg-white z-50 lg:hidden transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="p-6">
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </>
    );
}


const SORT_OPTIONS = [
    {value: "newest", label: "Newest"},
    {value: "price-asc", label: "Price (ascending)"},
    {value: "price-desc", label: "Price (descending)"},
];

function SortDropdown() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const current = SORT_OPTIONS.find(o => o.value === searchParams.get("sort")) ?? SORT_OPTIONS[0];

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node))
                setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSelect = (opt: typeof SORT_OPTIONS[0]) => {
        const params = new URLSearchParams(searchParams);
        params.set("sort", opt.value);
        router.push(`/shop?${params.toString()}`);
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-3 px-4 py-2.5 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-700 hover:border-neutral-400 transition-colors bg-white min-w-[180px] justify-between"
            >
                <span>{current.label}</span>
                <ChevronsUpDown size={14} className="text-neutral-400 shrink-0"/>
            </button>

            {open && (
                <div
                    className="absolute right-0 top-full mt-1.5 w-full bg-white border border-neutral-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    {SORT_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => handleSelect(opt)}
                            className={`w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-neutral-50 transition-colors ${
                                current.value === opt.value
                                    ? "font-bold text-neutral-900"
                                    : "text-neutral-600"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ShopPage({
                                     products,
                                 }: {
    products: ProductWithVariantsSerialized[];
}) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <main className="w-full min-h-screen bg-neutral-900/2">
            <Navigation showSearch/>

            <div className="px-6 md:px-12 pb-20 flex gap-10 items-start">
                <Reveal direction={"fromLeft"}
                        className="hidden lg:block w-[240px] shrink-0 sticky top-26 max-h-[calc(100vh-80px)] overflow-y-auto mt-6 ">
                    <FilterSidebar/>
                </Reveal>

                <Reveal fade className="flex-1 flex flex-col min-w-0 ">
                    <div className=" pt-10 pb-8">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-[clamp(3rem,8vw,5rem)] font-neutral-900 font-bold tracking-tighter leading-none">
                                    SHOP.
                                </h1>
                                <p className="text-neutral-500 font-medium text-xl mt-3">
                                    Curated furniture for the modern home.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setDrawerOpen(true)}
                                    className="lg:hidden inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-full font-bold text-sm"
                                >
                                    <SlidersHorizontal size={15}/>
                                    Filters
                                </button>

                                <SortDropdown/>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product}/>
                        ))}
                    </div>
                </Reveal>
            </div>

            <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}/>
        </main>
    );
}
