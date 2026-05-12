"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Package,
  ChevronDown,
  Star,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { SerializedProduct } from "@/types";
import ProductItem from "../ui/ProductItem";

const MOCK_REVIEWS = [
  {
    id: 1,
    author: "Amira K.",
    rating: 5,
    date: "April 15, 2025",
    text: "Outstanding build quality, exactly as pictured. Fast and flawless delivery. Highly recommend.",
  },
  {
    id: 2,
    author: "Marko P.",
    rating: 4,
    date: "March 2, 2025",
    text: "Very happy with the purchase. The material is solid and elegant — exactly what I was looking for.",
  },
  {
    id: 3,
    author: "Lejla S.",
    rating: 5,
    date: "February 20, 2025",
    text: "Excellent! Everyone at home loved it. I will definitely be shopping here again.",
  },
];

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: "Flexible delivery",
    desc: "We deliver to your address at an agreed time",
  },
  {
    icon: RotateCcw,
    title: "Unlimited returns",
    desc: "Full refund, no questions asked, at any time",
  },
  {
    icon: ShieldCheck,
    title: "Price guarantee",
    desc: "Find it cheaper — we'll refund the difference",
  },
  {
    icon: BadgeCheck,
    title: "Verified quality",
    desc: "Every product passes strict quality control",
  },
];

function formatPrice(price: number) {
  return `${price.toLocaleString("bs-BA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} KM`;
}

function StarRating({ rating, size = 15 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
    </div>
  );
}

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors duration-150"
      >
        <span className="font-semibold text-gray-900">{title}</span>
        <ChevronDown
          size={18}
          className={cn(
            "text-gray-400 transition-transform duration-300 flex-shrink-0",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="px-6 pb-6 pt-3 border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ProductClient({
  product,
  similar,
}: {
  product: SerializedProduct;
  similar: SerializedProduct[];
}) {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isFav, setIsFav] = useState(false);

  const currentVariant = product.variants[selectedVariantIdx];
  const currentImages = currentVariant?.images ?? [];
  const mainImage = currentImages[selectedImageIdx];

  const avgRating = Math.round(
    MOCK_REVIEWS.reduce((acc, r) => acc + r.rating, 0) / MOCK_REVIEWS.length,
  );

  const handleVariantChange = (idx: number) => {
    setSelectedVariantIdx(idx);
    setSelectedImageIdx(0);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 items-start">
          <div className="flex gap-3">
            {currentImages.length > 0 && (
              <div className="flex flex-col gap-2 flex-shrink-0">
                {currentImages.slice(0, 5).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIdx(i)}
                    className={cn(
                      "w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 bg-gray-50",
                      selectedImageIdx === i
                        ? "border-blue-500 shadow-md shadow-blue-100"
                        : "border-gray-200 hover:border-blue-300",
                    )}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 aspect-square rounded-2xl overflow-hidden bg-gray-50 relative">
              {mainImage ? (
                <img
                  key={`${selectedVariantIdx}-${selectedImageIdx}`}
                  src={mainImage.url}
                  alt={product.name}
                  className="w-full h-full object-cover animate-fadeIn"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={64} className="text-gray-300" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:pt-2">
            <span className="inline-flex items-center w-fit text-xs font-bold uppercase tracking-[0.15em] text-blue-500 bg-blue-50 px-3 py-1 rounded-full">
              {product.category?.name ?? "—"}
            </span>

            <h1 className="text-3xl xl:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-2">
              <StarRating rating={avgRating} size={16} />
              <span className="text-sm text-gray-500">
                ({MOCK_REVIEWS.length} reviews)
              </span>
            </div>

            <p className="text-3xl font-extrabold text-blue-600 tracking-tight">
              {formatPrice(product.price)}
            </p>

            <div className="h-px bg-gray-100" />

            {product.description && (
              <p className="text-gray-600 leading-relaxed text-[15px]">
                {product.description}
              </p>
            )}

            {product.dimensions && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-gray-900">Dimensions:</span>
                <span className="text-gray-600">{product.dimensions}</span>
              </div>
            )}

            {product.materials.length > 0 && (
              <div className="flex items-start gap-3">
                <span className="text-sm font-semibold text-gray-900 mt-0.5 whitespace-nowrap">
                  Materials:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.materials.map((m) => (
                    <span
                      key={m}
                      className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full font-medium"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.variants.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">
                  Color:
                </span>
                <div className="flex gap-2.5">
                  {product.variants.map((v, i) => (
                    <button
                      key={v.id}
                      title={v.color}
                      onClick={() => handleVariantChange(i)}
                      style={{ backgroundColor: v.color }}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all duration-200",
                        selectedVariantIdx === i
                          ? "border-blue-500 ring-2 ring-blue-200 ring-offset-2 scale-110"
                          : "border-white shadow-md hover:scale-105 hover:shadow-lg",
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="h-px bg-gray-100" />

            <div className="flex gap-3">
              <button
                onClick={() =>
                  toast.success("Added to cart", { description: product.name })
                }
                className="flex-1 flex items-center justify-center gap-2.5 bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-150 shadow-lg shadow-blue-200 text-sm"
              >
                <ShoppingCart size={18} />
                Add to cart
              </button>
              <button
                onClick={() => {
                  const next = !isFav;
                  setIsFav(next);
                  toast(
                    next ? "Added to favourites" : "Removed from favourites",
                  );
                }}
                className={cn(
                  "flex items-center justify-center w-14 h-14 rounded-xl border-2 transition-all duration-200",
                  isFav
                    ? "bg-red-50 border-red-300 text-red-500"
                    : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500",
                )}
              >
                <Heart
                  size={20}
                  className={cn(
                    "transition-all duration-200",
                    isFav && "fill-red-500 text-red-500",
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors duration-200 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors duration-200">
                <Icon size={22} className="text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{title}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 max-w-3xl mx-auto w-full">
          <Accordion title="Product details">
            <div className="divide-y divide-gray-100 text-sm">
              {product.dimensions && (
                <div className="flex justify-between py-3">
                  <span className="font-medium text-gray-900">Dimensions</span>
                  <span className="text-gray-600">{product.dimensions}</span>
                </div>
              )}
              {product.materials.length > 0 && (
                <div className="flex justify-between py-3">
                  <span className="font-medium text-gray-900">Materials</span>
                  <span className="text-gray-600">
                    {product.materials.join(", ")}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-3">
                <span className="font-medium text-gray-900">Category</span>
                <span className="text-gray-600">
                  {product.category?.name ?? "—"}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-medium text-gray-900">Variants</span>
                <span className="text-gray-600">{product.variants.length}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-medium text-gray-900">SKU</span>
                <span className="text-gray-600 font-mono">
                  #{product.id.toString().padStart(6, "0")}
                </span>
              </div>
            </div>
          </Accordion>

          <Accordion title="Customer reviews">
            <div className="space-y-6">
              <div className="flex items-center gap-5 pb-5 border-b border-gray-100">
                <span className="text-5xl font-extrabold text-gray-900 leading-none">
                  {avgRating}.0
                </span>
                <div>
                  <StarRating rating={avgRating} size={22} />
                  <p className="text-sm text-gray-500 mt-1.5">
                    {MOCK_REVIEWS.length} reviews
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {MOCK_REVIEWS.map((review, idx) => (
                  <div key={review.id}>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-semibold text-gray-900 text-sm">
                        {review.author}
                      </span>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {review.date}
                      </span>
                    </div>
                    <StarRating rating={review.rating} size={13} />
                    <p className="text-sm text-gray-600 leading-relaxed mt-2">
                      {review.text}
                    </p>
                    {idx < MOCK_REVIEWS.length - 1 && (
                      <div className="h-px bg-gray-100 mt-5" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Accordion>
        </div>

        {similar.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Similar products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similar.map((item) => (
                <ProductItem key={item.id} {...item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
