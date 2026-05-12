"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import Image from "next/image";
import { SerializedProduct } from "@/types";
import { addToFavourites, isFavourtied } from "@/data/shop/actions";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import getUser from "@/utils/getUser";

export default function ProductItem(product: SerializedProduct) {
  const router = useRouter();
  const [favouritedUX, setFavouritedUX] = useState(false);

  useEffect(() => {
    async function checkFav() {
      const user = await getUser();
      if (!user) return;
      isFavourtied(product.id, user.id).then((result) =>
        setFavouritedUX(result !== null),
      );
    }
    checkFav();
  }, [product.id]);

  async function handleFavourites(e: React.MouseEvent) {
    e.preventDefault();
    const user = await getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setFavouritedUX((prev) => !prev);
    const result = await addToFavourites(product.id, user.id);
    if (result.favourtied) toast.success("Proizvod uspješno dodan u omiljene.");
    else toast.success("Proizvod više nije u listi omiljenih.");
  }

  const hasImage = product.variants?.[0]?.images?.[0]?.url;

  return (
    <div className="group flex flex-col bg-white w-[180px] sm:w-[220px] md:w-[240px] shrink-0">
      <div className="relative w-full h-[220px] sm:h-[280px] md:h-[300px] overflow-hidden rounded-xl bg-neutral-100">
        {hasImage && (
          <Link href={`/shop/${product.id}`} className="block w-full h-full">
            <Image
              src={product.variants[0].images[0].url}
              alt={product.name}
              fill
              sizes="240px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        )}

        {product.salePrice && (
          <span className="absolute top-3 left-3 bg-blue-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            -
            {Math.round(
              (1 - Number(product.salePrice) / Number(product.price)) * 100,
            )}
            %
          </span>
        )}

        <div className="absolute top-3 right-3 flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex">
          <button
            onClick={handleFavourites}
            className="p-2 bg-white rounded-full shadow-sm hover:bg-neutral-50 transition-colors"
            aria-label="Add to favorites"
          >
            <Heart
              size={16}
              className={
                favouritedUX ? "fill-red-500 text-red-500" : "text-neutral-900"
              }
            />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1 px-0.5">
        <Link
          href={`/shop/${product.id}`}
          className="hover:text-blue-600 transition-colors"
        >
          <h3 className="text-neutral-900 font-semibold text-sm truncate tracking-tight">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-blue-600 font-bold text-sm">
            {Number(product.salePrice ?? product.price).toFixed(2)} KM
          </span>
          {product.salePrice && (
            <span className="text-neutral-400 line-through text-xs">
              {Number(product.price).toFixed(2)} KM
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
