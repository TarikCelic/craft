"use client";

import {useState} from "react";
import Navigation from "@/components/navigation/Navigation";
import {ChevronDown, Trash2, Minus, ShoppingBag, Tag} from "lucide-react";
import Image from "next/image";
import {Prisma} from "@/app/generated/prisma/client";
import Link from "next/link";
import {ItemDelete, ItemMinus} from "@/data/cart/actions";
import {useCartStore} from "@/globalStates/shop";
import {count} from "console";
import CheckoutModal from "@/components/cart/CheckoutModal";
import {CartWithItems} from "@/types";
import {Reveal} from "@/components/ui/Reveal";


type CartItem = CartWithItems["items"][0];

interface CartClientProps {
    cart: CartWithItems | null;
}

export default function CartClient({cart}: CartClientProps) {
    const [items, setItems] = useState<CartItem[]>(cart?.items ?? []);
    const [couponOpen, setCouponOpen] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    const value = useCartStore((state) => state.setCount);

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
        ItemDelete(id);
        value(0);
    };

    const decrement = useCartStore((state) => state.decrement);

    const decreaseQty = (id: number) => {
        setItems((prev) =>
            prev
                .map((item) =>
                    item.id === id ? {...item, quantity: item.quantity - 1} : item,
                )
                .filter((item) => item.quantity > 0),
        );

        decrement();
        ItemMinus(id);
    };

    const subtotal = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
    );
    const shipping = 0;
    const tax = +(subtotal * 0.01).toFixed(2);
    const total = subtotal + shipping + tax;

    function finishOrder() {
        setItems([]);
        value(0);
    }

    return (
        <>
            <Navigation/>
            <CheckoutModal
                onSuccess={finishOrder}
                userID={cart?.userId}
                open={checkoutOpen}
                onClose={() => setCheckoutOpen(false)}
                total={total}
            />
            <main className="flex flex-col lg:flex-row min-h-[calc(100dvh-75px)] bg-[#f9f8f6]">
                <section className="flex-1 border-b lg:border-b-0 lg:border-r border-neutral-900/8 p-0 overflow-y-auto">
                    {items.length >= 1 && (
                        <Reveal duration={1000} fade className="flex items-baseline gap-3 p-6">
                            <h1 className="text-3xl font-light tracking-tight text-gray-900">
                                {items.length !== 0 && "Your Cart"}
                            </h1>
                            {items.length > 0 && (
                                <span className="text-sm text-gray-400 font-normal">
                  {items.reduce((s, i) => s + i.quantity, 0)} items
                </span>
                            )}
                        </Reveal>
                    )}

                    {items.length === 0 && (
                        <Reveal fade duration={1000}
                                className="flex flex-col items-center justify-center min-h-[calc(100dvh-75px)] max-h-[calc(100dvh-75px)] text-center">
                            <ShoppingBag
                                size={48}
                                strokeWidth={1}
                                className="text-gray-300 mb-4"
                            />
                            <p className="text-gray-500 text-lg font-medium">
                                Your cart is empty
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                                Add some items to get started
                            </p>
                        </Reveal>
                    )}

                    {items.length >= 1 && (
                        <div className="grid grid-cols-2 px-6 pb-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                            {items.map((item, i) => (
                                <Reveal direction={"fromDown"}
                                        key={item.id} delay={i * 200}>
                                    <CartCard
                                        item={item}
                                        onRemove={removeItem}
                                        onDecrease={decreaseQty}
                                    />
                                </Reveal>
                            ))}
                        </div>
                    )}
                </section>

                <Reveal fade duration={1000}
                        className="w-full lg:w-[340px] lg:shrink-0 p-6 flex flex-col bg-white border-t lg:border-t-0 lg:border-l border-neutral-900/8 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto max-h-[calc(100dvh-75px)]">
                    <p className="text-xl font-semibold tracking-tight text-gray-900 mb-8">
                        Summary
                    </p>

                    <div className="mb-6">
                        <button
                            onClick={() => setCouponOpen((o) => !o)}
                            className="w-full flex justify-between items-center px-4 py-3 border border-neutral-900/10 rounded-xl text-sm text-gray-600 hover:border-gray-400 transition-colors duration-200"
                        >
              <span className="flex items-center gap-2">
                <Tag size={15} className="text-gray-400"/>
                Have a coupon?
              </span>
                            <ChevronDown
                                size={15}
                                className={`text-gray-400 transition-transform duration-200 ${couponOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {couponOpen && (
                            <div className="mt-2 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className="flex-1 px-3 py-2.5 border border-neutral-900/10 rounded-xl text-sm outline-none focus:border-blue-400 transition-colors"
                                />
                                <button
                                    className="px-3 py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors">
                                    Apply
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3 text-sm">
                        <SummaryRow
                            label="Subtotal"
                            value={subtotal > 0 ? `${subtotal} KM` : "—"}
                        />
                        <SummaryRow
                            label="Estimated shipping"
                            value={shipping > 0 ? `${shipping} KM` : "0 KM"}
                        />
                        <SummaryRow
                            label="Estimated tax (1%)"
                            value={tax > 0 ? `${tax} KM` : "—"}
                        />
                    </div>

                    <div className="border-t border-dashed border-neutral-900/10 my-5"/>

                    <div className="flex justify-between items-center text-base font-semibold text-gray-900">
                        <span>Total</span>
                        <span>{total > 0 ? `${total.toFixed(2)} KM` : "—"}</span>
                    </div>

                    <button
                        disabled={items.length === 0}
                        onClick={() => setCheckoutOpen(true)}
                        className="mt-6 w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors duration-200 tracking-wide"
                    >
                        {items.length === 0 ? "Cart is empty" : "Proceed to Checkout"}
                    </button>
                </Reveal>
            </main>
        </>
    );
}

function CartCard({
                      item,
                      onRemove,
                      onDecrease,
                  }: {
    item: CartItem;
    onRemove: (id: number) => void;
    onDecrease: (id: number) => void;
}) {
    const [hovered, setHovered] = useState(false);

    const imageSrc = item.variant?.images?.[0]?.url ?? "/placeholder.avif";
    const variantColor = item.variant?.color ?? "#94a3b8";

    return (
        <Link href={`/shop/${item.product.id}`}>
            <div
                className="group border border-neutral-900/8 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div className="relative aspect-square overflow-hidden cursor-pointer">
                    <Image
                        src={imageSrc}
                        alt={item.product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div
                        className={`absolute inset-0 transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}
                    >
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-neutral-900/30 via-transparent to-transparent pointer-events-none"/>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDecrease(item.id);
                            }}
                            className="absolute bottom-2 left-2 w-8 h-8 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg shadow-md z-10 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                            title="Decrease quantity"
                        >
                            <Minus size={13} strokeWidth={2.5} className="text-gray-700"/>
                        </button>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onRemove(item.id);
                            }}
                            className="absolute bottom-2 right-2 w-8 h-8 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg shadow-md hover:bg-red-50 hover:text-red-500 transition-colors duration-150 z-10 text-gray-700"
                            title="Remove item"
                        >
                            <Trash2 size={13} strokeWidth={2}/>
                        </button>
                    </div>
                </div>

                <div className="px-3.5 pb-3.5 pt-3">
                    <div className="flex justify-between items-start mb-1.5">
                        <p className="text-[0.82rem] font-[500] text-gray-900 leading-tight pr-1">
                            {item.product.name}
                        </p>
                        <span
                            className="mt-0.5 w-3 h-3 rounded-full shrink-0 ring-2 ring-white ring-offset-1"
                            style={{
                                backgroundColor: variantColor,
                                boxShadow: `0 0 0 1.5px ${variantColor}55`,
                            }}
                            title={item.variant?.color ?? "Default"}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <p className="text-blue-600 font-[700] text-[0.9rem]">
                            {item.product.price} KM
                        </p>
                        <span className="text-[0.75rem] text-gray-400 tabular-nums">
              ×{item.quantity}
            </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function SummaryRow({label, value}: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center text-gray-600">
            <span>{label}</span>
            <span className="font-[500] text-gray-800 tabular-nums">{value}</span>
        </div>
    );
}
