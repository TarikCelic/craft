"use client";
import {useRef} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import Link from "next/link";
import ProductItem from "@/components/ui/ProductItem";
import {SaleGridProps} from "@/types";
import {Reveal} from "@/components/ui/Reveal";

const SaleGrid = ({products, header, paragraf}: SaleGridProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right"): void => {
        if (!scrollRef.current) return;
        const {scrollLeft, clientWidth} = scrollRef.current;
        scrollRef.current.scrollTo({
            left: direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth,
            behavior: "smooth",
        });
    };

    return (
        <>

            <section className="w-full py-16">
                <div className="px-4 lg:px-8 max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                        <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">
                            {header}
                        </span>
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mt-2">
                                {paragraf}
                            </h2>
                        </div>
                        <Link
                            href="/shop"
                            className="hidden md:block font-semibold border-b-2 border-neutral-900 pb-1 hover:text-blue-600 hover:border-blue-600 transition-all text-sm"
                        >
                            View All
                        </Link>
                    </div>

                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:flex-wrap md:overflow-x-hidden md:pb-0"
                        style={{scrollbarWidth: "none"}}
                    >
                        {products?.map((product, i) => (
                            <Reveal delay={i * 200} key={product.id} className="snap-start shrink-0 ">
                                <ProductItem {...product}/>
                            </Reveal>
                        ))}
                    </div>

                    <div className="md:hidden mt-4 flex gap-3">
                        <button
                            onClick={() => scroll("left")}
                            className="flex-1 bg-neutral-100 py-3.5 rounded-xl flex justify-center active:bg-neutral-200 transition-colors"
                        >
                            <ChevronLeft size={22}/>
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="flex-1 bg-neutral-100 py-3.5 rounded-xl flex justify-center active:bg-neutral-200 transition-colors"
                        >
                            <ChevronRight size={22}/>
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SaleGrid;