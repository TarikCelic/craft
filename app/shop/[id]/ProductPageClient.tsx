"use client";

import ProductsInOneRow from "@/components/ui/ProductsInOneRow";
import {Breadcrumbs} from "@heroui/react";
import Image from "next/image";
import {useEffect, useState, useMemo, useRef} from "react";
import {createPortal} from "react-dom";
import getUser from "@/utils/getUser";
import type {SerializedProduct} from "@/types";
import {toast} from "sonner";
import {addToFavourites, isFavourtied} from "@/data/shop/actions";
import Navigation from "@/components/navigation/Navigation";
import {
    ShoppingCart,
    Heart,
    Van,
    BanknoteArrowUp,
    Info,
    X,
    ChevronRight,
    Star,
} from "lucide-react";
import {addToCart} from "@/data/shop/actions";
import {useCartStore} from "@/globalStates/shop";
import type {ProductWithVariantsSerialized} from "@/types";
import Footer from "@/components/Footer";
import {Reveal} from "@/components/ui/Reveal";

type Panel = "details" | "reviews";

type Props = {
    product: ProductWithVariantsSerialized;
    similar: SerializedProduct[];
};

function Stars({rating, size = 14}: { rating: number; size?: number }) {
    return (
        <div className="flex gap-0.5 shrink-0" aria-hidden="true">
            {Array.from({length: 5}).map((_, i) => (
                <Star
                    key={i}
                    size={size}
                    className={
                        i < rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-200 fill-gray-200"
                    }
                />
            ))}
        </div>
    );
}

function Section({
                     title,
                     children,
                 }: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="mb-6 last:mb-0">
            <p className="text-gray-400 font-mono font-bold tracking-[0.12rem] text-[0.72rem] uppercase mb-3">
                {title}
            </p>
            {children}
        </div>
    );
}

function Label({children}: { children: React.ReactNode }) {
    return (
        <p className="text-gray-400 font-mono font-bold tracking-[0.1rem] text-[0.72rem] uppercase mb-1">
            {children}
        </p>
    );
}

function Sidebar({
                     open,
                     panel,
                     onClose,
                     onSwitch,
                 }: {
    open: boolean;
    panel: Panel;
    onClose: () => void;
    onSwitch: (p: Panel) => void;
}) {
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const scrollYRef = useRef(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
            const scrollBarWidth =
                window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollBarWidth}px`;
            requestAnimationFrame(() => setVisible(true));
        } else {
            setVisible(false);
            const t = setTimeout(() => {
                document.body.style.overflow = "";
                document.body.style.paddingRight = "";
            }, 300);
            return () => clearTimeout(t);
        }
    }, [open]);

    if (!mounted || (!open && !visible)) return null;

    const content = (
        <>
            <div
                className="fixed inset-0 z-80 bg-neutral-900/40 backdrop-blur-[2px] transition-opacity duration-300 touch-none"
                style={{opacity: visible ? 1 : 0}}
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                className="fixed top-0 right-0 z-90 h-[100dvh] w-full md:w-[480px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out will-change-transform"
                style={{transform: visible ? "translateX(0)" : "translateX(100%)"}}
                role="dialog"
                aria-modal="true"
            >
                <div
                    className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-neutral-900/10 shrink-0">
                    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg" role="tablist">
                        {(["details", "reviews"] as Panel[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => onSwitch(p)}
                                role="tab"
                                aria-selected={panel === p}
                                className={`px-4 py-1.5 text-[0.78rem] font-mono font-bold uppercase tracking-widest rounded-md transition-all duration-200 cursor-pointer ${
                                    panel === p
                                        ? "bg-white text-blue-500 shadow-sm"
                                        : "text-gray-500 hover:text-gray-800"
                                }`}
                            >
                                {p === "details" ? "Details" : "Reviews"}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-gray-500 hover:text-gray-800"
                        aria-label="Close panel"
                    >
                        <X size={18}/>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 min-h-0">
                    {panel === "details" ? <DetailsPanel/> : <ReviewsPanel/>}
                </div>
            </div>
        </>
    );

    return createPortal(content, document.body);
}

function DetailsPanel() {
    return (
        <div className="space-y-6">
            <Section title="About the product">
                <p className="text-gray-600 leading-relaxed text-[0.92rem]">
                    The chair is made from solid oak with a hand-applied oil wax finish.
                    Each piece is unique due to the natural grain of the wood. The metal
                    supports are made from steel profiles with a powder-coated
                    corrosion-resistant finish.
                </p>
            </Section>
            <Section title="Specifications">
                <div className="space-y-3">
                    {[
                        ["Dimensions", "200 × 200 × 200 cm"],
                        ["Weight", "28 kg"],
                        ["Finish", "Oil wax"],
                        ["Warranty", "5 years"],
                        ["Origin", "Bosnia and Herzegovina"],
                    ].map(([label, value]) => (
                        <div
                            key={label}
                            className="flex justify-between items-center py-2 border-b border-neutral-900/5 last:border-0"
                        >
              <span className="text-[0.78rem] font-mono font-bold text-gray-400 uppercase tracking-wider">
                {label}
              </span>
                            <span className="text-[0.88rem] font-medium text-gray-800">
                {value}
              </span>
                        </div>
                    ))}
                </div>
            </Section>
            <Section title="Care & maintenance">
                <ul className="space-y-2">
                    {[
                        "Wipe with a damp microfibre cloth.",
                        "Avoid direct sunlight for more than 4 hours a day.",
                        "Apply protective wood wax once a year.",
                        "Use a dry cloth for metal parts.",
                    ].map((item, i) => (
                        <li key={i} className="flex gap-3 text-[0.88rem] text-gray-600">
                            <span className="mt-0.5 text-blue-500 shrink-0">—</span>
                            {item}
                        </li>
                    ))}
                </ul>
            </Section>
            <Section title="Delivery & assembly">
                <p className="text-gray-600 leading-relaxed text-[0.92rem]">
                    Delivery within 5–10 business days. Includes free assembly for orders
                    over 500 KM. Our team will contact you 24 hours before delivery.
                </p>
            </Section>
        </div>
    );
}

function ReviewsPanel() {
    const reviews = [
        {
            name: "Amira K.",
            date: "March 2025",
            rating: 5,
            text: "Outstanding quality. The chair looks even better in person than in the photos. Assembly was fast and professional.",
        },
        {
            name: "Damir H.",
            date: "Feb 2025",
            rating: 4,
            text: "Solid build, the wood feels warm and natural. Only downside was a slightly longer delivery wait, but well worth it.",
        },
        {
            name: "Lejla M.",
            date: "Jan 2025",
            rating: 5,
            text: "Bought it for the living room and it fits perfectly. Top-quality material, exactly as described.",
        },
        {
            name: "Nedim P.",
            date: "Dec 2024",
            rating: 5,
            text: "Highly recommend. Modern design, the wood adds warmth to the room. Excellent customer service.",
        },
    ];

    const {avg, distribution} = useMemo(() => {
        const total = reviews.reduce((s, r) => s + r.rating, 0);
        const avgRating = (total / reviews.length).toFixed(1);
        const dist = [5, 4, 3, 2, 1].map((n) => {
            const count = reviews.filter((r) => r.rating === n).length;
            return {rating: n, count, pct: (count / reviews.length) * 100};
        });
        return {avg: avgRating, distribution: dist};
    }, [reviews]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-center shrink-0">
                    <p className="text-4xl font-bold text-gray-900">{avg}</p>
                    <Stars rating={5} size={14}/>
                    <p className="text-[0.75rem] text-gray-400 mt-1">
                        {reviews.length} reviews
                    </p>
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                    {distribution.map(({rating, pct, count}) => (
                        <div key={rating} className="flex items-center gap-2">
                            <span className="text-[0.72rem] text-gray-400 w-2">{rating}</span>
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-400 rounded-full transition-all duration-700"
                                    style={{width: `${pct}%`}}
                                />
                            </div>
                            <span className="text-[0.72rem] text-gray-400 w-4">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="space-y-4">
                {reviews.map((r, i) => (
                    <div
                        key={i}
                        className="p-4 border border-neutral-900/10 rounded-xl space-y-2"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="font-mono font-bold text-[0.85rem]">{r.name}</p>
                                <p className="text-[0.75rem] text-gray-400">{r.date}</p>
                            </div>
                            <Stars rating={r.rating} size={13}/>
                        </div>
                        <p className="text-[0.88rem] text-gray-600 leading-relaxed">
                            {r.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ProductPageClient({product, similar}: Props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activePanel, setActivePanel] = useState<Panel>("details");
    const [activeImage, setActiveImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
    const [pcs, setPcs] = useState(1);
    const [favouritedUX, setFavouritedUX] = useState(false);

    const openPanel = (p: Panel) => {
        setActivePanel(p);
        setSidebarOpen(true);
    };

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

    async function handleFavourites() {
        const user = await getUser();
        if (!user) {
            toast.error("You must be logged in.");
            return;
        }
        setFavouritedUX((prev) => !prev);
        const result = await addToFavourites(product.id, user.id);
        if (result.favourtied) toast.success("Product added to favourites.");
        else toast.success("Product removed from favourites.");
    }

    const displayImages = useMemo(() => {
        if (!selectedVariant?.images?.length) return ["/placeholder.avif"];
        return [...selectedVariant.images]
            .sort((a, b) => a.order - b.order)
            .map((img) => img.url);
    }, [selectedVariant]);

    const handleVariantChange = (variant: (typeof product.variants)[0]) => {
        setSelectedVariant(variant);
        setActiveImage(0);
    };

    const blurDataURL =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

    const increment = useCartStore((state) => state.increment);

    async function handleCarting() {
        const user = await getUser();
        if (!user) {
            toast.error("You must be logged in.");
            return;
        }
        await addToCart(product.id, selectedVariant.id, pcs);
        increment(pcs);
        toast.success("Product added to cart.");
    }

    return (
        <>
            <Navigation className="w-full"/>

            <div className="w-full max-w-6xl mx-auto lg:mt-10 lg:mb-5">
                <Breadcrumbs>
                    <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
                    <Breadcrumbs.Item href="/shop">Shop</Breadcrumbs.Item>
                    <Breadcrumbs.Item>{product.name}</Breadcrumbs.Item>
                </Breadcrumbs>
            </div>

            <section className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 md:items-start lg:max-w-6xl lg:mx-auto">
                    <Reveal direction={"fromLeft"} className="min-w-0 md:sticky md:top-0 px-0 ">
                        <div
                            className="relative w-full overflow-hidden rounded-lg"
                            style={{paddingBottom: "100%"}}
                        >
                            <Image
                                fill
                                src={displayImages[activeImage]}
                                alt={product.name}
                                className="object-cover"
                                priority
                                sizes="(min-width: 768px) 50vw, 100vw"
                                placeholder="blur"
                                blurDataURL={blurDataURL}
                            />
                        </div>

                        {displayImages.length > 0 && (
                            <div className="flex gap-2 pt-3 overflow-x-auto pb-3 snap-x">
                                {displayImages.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors snap-center ${
                                            activeImage === i
                                                ? "border-blue-400"
                                                : "border-transparent"
                                        }`}
                                        aria-label={`Image ${i + 1}`}
                                    >
                                        <Image
                                            fill
                                            src={src}
                                            alt="thumb"
                                            className="object-cover"
                                            sizes="64px"
                                            placeholder="blur"
                                            blurDataURL={blurDataURL}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </Reveal>

                    <Reveal direction={"fromRight"}
                            className="min-w-0 px-4 pb-8 flex flex-col gap-5 md:px-8 lg:px-10 ">
                        <div>
              <span
                  className="inline-flex items-center px-3 py-1 bg-blue-50 rounded-full border border-blue-200 font-mono font-bold text-blue-500 text-[0.72rem] tracking-widest uppercase">
                {product.category.name}
              </span>
                            <div className="flex justify-between items-center">
                                <h1 className="mt-2 text-[1.6rem] md:text-[1.9rem] font-bold leading-tight">
                                    {product.name}
                                </h1>
                                <button
                                    className="p-3.5 active:scale-[0.98] cursor-pointer rounded-xl transition-all duration-200 text-neutral-900 shrink-0"
                                    aria-label="Favourites"
                                    onClick={handleFavourites}
                                >
                                    <Heart size={25} fill={favouritedUX ? "black" : "none"}/>
                                </button>
                            </div>
                            {!product.salePrice ? (
                                <p className="text-2xl font-bold text-blue-500 mt-1">
                                    {product.price} KM
                                </p>
                            ) : (
                                <div className="flex gap-4 items-center">
                                    <p className="text-2xl font-bold text-blue-500">
                                        {product.salePrice} KM
                                    </p>
                                    <p className="font-bold text-gray-400 line-through">
                                        {product.price} KM
                                    </p>
                                </div>
                            )}
                        </div>

                        <hr className="border-neutral-900/10"/>

                        {product.description && (
                            <div>
                                <Label>Description</Label>
                                <p className="text-gray-600 leading-relaxed text-[0.9rem]">
                                    {product.description}
                                </p>
                            </div>
                        )}
                        {product.dimensions && (
                            <div>
                                <Label>Dimensions</Label>
                                <p className="text-gray-600 leading-relaxed text-[0.9rem]">
                                    {product.dimensions}
                                </p>
                            </div>
                        )}
                        {product.materials.length > 0 && (
                            <div>
                                <Label>Materials</Label>
                                <p className="text-gray-700 text-[0.9rem]">
                                    {product.materials.join(", ")}
                                </p>
                            </div>
                        )}
                        {product.variants.length > 0 && (
                            <div>
                                <Label>Colors</Label>
                                <div className="flex flex-wrap gap-3 mt-2">
                                    {product.variants.map((v) => (
                                        <button
                                            key={v.id}
                                            onClick={() => handleVariantChange(v)}
                                            style={{background: v.color}}
                                            title={v.color}
                                            className={`h-6 w-6 rounded-full outline-offset-2 transition-all duration-200 cursor-pointer ${
                                                selectedVariant.id === v.id
                                                    ? "outline-2 outline-blue-500 scale-110 shadow-md"
                                                    : "outline-1 outline-neutral-900/10 hover:outline-neutral-900/40"
                                            }`}
                                            aria-label={`Color ${v.color}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <hr className="border-neutral-900/10"/>

                        <div className="flex flex-col">
                            <Label>Quantity</Label>
                            <div className="flex gap-3">
                                <input
                                    type="number"
                                    min={1}
                                    onChange={(e) => setPcs(parseInt(e.target.value) || 1)}
                                    value={pcs}
                                    className="border border-neutral-900/10 rounded-xl max-w-20 px-2 pl-4 focus:outline-blue-500"
                                />
                                <button
                                    onClick={handleCarting}
                                    className="flex-1 py-3.5 px-5 cursor-pointer bg-blue-500 hover:bg-blue-600 active:scale-[0.98] font-mono font-bold flex justify-center items-center gap-3 text-white rounded-xl transition-all duration-200 text-[0.88rem]"
                                >
                                    <ShoppingCart size={18} className="shrink-0"/>
                                    Add to cart
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {(
                                [
                                    {panel: "details" as Panel, label: "Details"},
                                    {panel: "reviews" as Panel, label: "Reviews"},
                                ] as const
                            ).map(({panel, label}) => (
                                <button
                                    key={panel}
                                    onClick={() => openPanel(panel)}
                                    className="flex-1 flex items-center justify-between px-4 py-2.5 rounded-xl border border-neutral-900/10 hover:border-blue-300 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-200 cursor-pointer group"
                                >
                  <span className="font-mono font-bold text-[0.75rem] uppercase tracking-wider">
                    {label}
                  </span>
                                    <ChevronRight
                                        size={14}
                                        className="shrink-0 group-hover:translate-x-0.5 transition-transform"
                                    />
                                </button>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </section>

            <Reveal direction={"fromDown"} className="px-4 py-8 lg:max-w-7xl lg:mx-auto lg:px-10 ">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        {
                            icon: <Van size={20} className="text-blue-500"/>,
                            title: "Free delivery",
                            desc: "Fast and free delivery on all orders with no hidden costs.",
                        },
                        {
                            icon: <BanknoteArrowUp size={20} className="text-blue-500"/>,
                            title: "Money-back guarantee",
                            desc: "Not satisfied? Full refund within the return period.",
                        },
                        {
                            icon: <Info size={20} className="text-blue-500"/>,
                            title: "24/7 support",
                            desc: "Our team is always available for any order-related questions.",
                        },
                    ].map(({icon, title, desc}, i) => (
                        <Reveal
                            direction={"fromDown"}
                            delay={i * 200}
                            key={title}
                            className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl border border-neutral-900/2 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-2">
                                {icon}
                                <p className="font-mono font-bold text-[0.78rem] uppercase tracking-wider text-blue-500">
                                    {title}
                                </p>
                            </div>
                            <p className="text-gray-600 text-[0.88rem] leading-relaxed">
                                {desc}
                            </p>
                        </Reveal>
                    ))}
                </div>
            </Reveal>

            <div className="lg:max-w-7xl lg:mx-auto">
                <ProductsInOneRow
                    products={similar}
                    header="Similar products"
                    paragraf="You might also like"
                />
            </div>

            <Sidebar
                open={sidebarOpen}
                panel={activePanel}
                onClose={() => setSidebarOpen(false)}
                onSwitch={(p) => setActivePanel(p)}
            />
            <Footer className={"!rounded-none"}/>
        </>
    );
}
