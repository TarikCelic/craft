"use client";
import {Heart} from "lucide-react";
import ProductItem from "@/components/ui/ProductItem";
import {SerializedProduct} from "@/types";
import {Reveal} from "@/components/ui/Reveal";

export type FavouritesClientProps = {
    products: SerializedProduct[];
};

export default function FavouritesClient({products}: FavouritesClientProps) {
    if (products.length === 0) {
        return (
            <div className="min-h-[300px] flex justify-center items-center flex-col gap-4 text-gray-500">
                <Heart size={36} strokeWidth={1.5}/>
                <p className="text-lg font-light">Your wishlist is empty.</p>
            </div>
        );
    }

    return (
        <Reveal fade duration={1000} className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto ">
            <div className="mb-6 sm:mb-8">
                <p className="text-2xl sm:text-3xl font-light">My Wishlist</p>
                <p className="text-sm sm:text-base font-light text-gray-500 mt-1">
                    {products.length} {products.length === 1 ? "item" : "items"} saved
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {products.map((fav, i) => (
                    <Reveal key={fav.id} delay={i * 150} className={""}>
                        <ProductItem  {...fav} />
                    </Reveal>
                ))}
            </div>
        </Reveal>
    );
}