"use client";

import {useState, useEffect, useRef, useLayoutEffect, useSyncExternalStore} from "react";
import {createPortal} from "react-dom";
import {SearchField} from "@heroui/react";
import {PackageOpen} from "lucide-react";
import {handleQuery} from "@/data/search/actions";
import type {SerializedProduct} from "@/types";
import ProductItem from "@/components/ui/ProductItem";

type Props = {
    isDark: boolean;
    className?: string;
    onResultClick?: () => void;
};

export default function SearchSection({
                                          isDark,
                                          className = "",
                                          onResultClick,
                                      }: Props) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SerializedProduct[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    const containerRef = useRef<HTMLDivElement>(null);

    const mounted = useSyncExternalStore(
        () => () => {
        },
        () => true,
        () => false
    );

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim()) {
                try {
                    const data = await handleQuery(query);
                    setResults(data);
                } catch {
                    setResults([]);
                }
            } else {
                setResults([]);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    const showDropdown = isFocused && query.length > 0;

    useLayoutEffect(() => {
        if (!showDropdown || !containerRef.current) return;

        const updatePosition = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            setDropdownStyle({
                position: "fixed",
                top: rect.bottom + 8,
                left: rect.left,
                width: rect.width,
                zIndex: 9999,
            });
        };

        const raf = requestAnimationFrame(updatePosition);
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [showDropdown]);

    useEffect(() => {
        const handlePointerDown = (e: PointerEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsFocused(false);
            }
        };
        document.addEventListener("pointerdown", handlePointerDown);
        return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, []);

    const handleResultClick = () => {
        setIsFocused(false);
        setQuery("");
        setResults([]);
        onResultClick?.();
    };

    return (
        <div ref={containerRef} className={`relative w-full ${className}`}>
            <SearchField className="w-full" onFocus={() => setIsFocused(true)}>
                <SearchField.Group>
                    <SearchField.SearchIcon/>
                    <SearchField.Input
                        className="w-full"
                        placeholder="Search..."
                        onChange={(e) => setQuery(e.target.value)}
                        value={query}
                    />
                    <SearchField.ClearButton
                        onClick={() => {
                            setQuery("");
                            setResults([]);
                        }}
                    />
                </SearchField.Group>
            </SearchField>

            {mounted && createPortal(
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out
                        bg-white shadow-2xl border border-gray-100 rounded-3xl
                        ${showDropdown ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
                    style={dropdownStyle}
                >
                    <div className="p-4 flex flex-col min-h-[100px] max-h-[450px] overflow-y-auto">
                        {query.trim() && results.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-neutral-400">
                                <PackageOpen size={40} strokeWidth={1.5} className="mb-3"/>
                                <p className="text-base font-medium">No products found</p>
                                <p className="text-xs mt-1">Try a different keyword.</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-4 px-2 relative">
                                {results.map((product) => (
                                    <ProductItem key={product.id} {...product}/>
                                ))}
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}