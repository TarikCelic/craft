import Link from "next/link";
import Image from "next/image";
import {ArrowRight} from "lucide-react";
import {Reveal} from "@/components/ui/Reveal";

const FEATURED_PRODUCTS = [
    {
        title: "Minimalist Oak Chair",
        price: "$240",
        href: "/shop/oak-chair",
        image: "/home/bento/chair.avif",
    },
    {
        title: "Architectural Lamp",
        price: "$180",
        href: "/shop/lamp",
        image: "/home/bento/lamp.avif",
    },
];

export default function BentoGrid() {
    return (
        <section className="w-full py-12">
            <Reveal direction={"fromDown"} className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                {FEATURED_PRODUCTS.map((product) => (
                    <Link
                        key={product.title}
                        href={product.href}
                        className="group relative h-[60vh] overflow-hidden rounded-3xl bg-neutral-100"
                    >
                        <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div
                            className="absolute inset-0 bg-neutral-900/10 transition-colors duration-300 group-hover:bg-neutral-900/30"/>

                        <div className="absolute top-8 left-8">
                            <h3 className="text-white text-2xl font-bold tracking-tight">
                                {product.title}
                            </h3>
                            <p className="text-white/90 font-medium mt-1">{product.price}</p>
                        </div>

                        <div className="absolute bottom-8 right-8">
                            <div
                                className="w-12 h-12 bg-white rounded-full flex items-center justify-center transform translate-y-16 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                <ArrowRight size={20} strokeWidth={2.5}/>
                            </div>
                        </div>
                    </Link>
                ))}

                <Reveal direction={"fromDown"}
                        className="group relative md:col-span-2 h-[50vh] overflow-hidden rounded-3xl bg-neutral-900 ">
                    <Link
                        href="/about"
                    >
                        <Image
                            src="/home/featured/craftsman.avif"
                            alt="The Man Behind The Craft"
                            fill
                            sizes="100vw"
                            className="object-cover opacity-80 transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent via-30%"/>

                        <div
                            className="absolute inset-0 flex flex-col justify-center p-8 md:p-16"
                            style={{
                                backgroundImage: "url('/tarik1920x1080.png')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                        <span className="text-white/60 uppercase tracking-[0.3em] text-sm mb-4">
                            Our Story
                        </span>
                            <h2 className="text-white text-4xl md:text-6xl font-bold max-w-xl leading-tight">
                                The Man Behind <br/> The Craft
                            </h2>
                            <div
                                className="mt-8 flex items-center gap-4 text-white font-semibold group-hover:gap-6 transition-all duration-300">
                                <span className="border-b-2 border-white pb-1">Read Biography</span>
                                <ArrowRight size={22} strokeWidth={2.5}/>
                            </div>
                        </div>
                    </Link>
                </Reveal>
            </Reveal>
        </section>
    );
}