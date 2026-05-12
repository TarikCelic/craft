import Link from "next/link";
import Image from "next/image";

import kitchen from "@/public/home/explroe/kitchen.avif";
import office from "@/public/home/explroe/office.avif";
import bedroom from "@/public/home/explroe/bedroom.avif";
import {Reveal} from "@/components/ui/Reveal";

const CATEGORIES = [
    {
        title: "Kitchen",
        href: "/shop?room=KITCHEN",
        image: kitchen,
    },
    {
        title: "Office",
        href: "/shop?room=OFFICE",
        image: office,
    },
    {
        title: "Bedroom",
        href: "/shop?room=BEDROOM",
        image: bedroom,
    },
];

export default function CategoryGrid() {
    return (
        <div className="w-full py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CATEGORIES.map((category, i) => (
                    <Reveal distance={20}
                            className="group relative h-[50vh] overflow-hidden rounded-2xl bg-neutral-200 "
                            key={category.title}
                            delay={i * 350}>
                        <Link
                            href={category.href}
                        >
                            <Image
                                src={category.image}
                                alt={category.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                priority={category.title === "Kitchen"}
                            />

                            <div
                                className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/20 to-transparent transition-opacity duration-300 group-hover:opacity-90"/>

                            <div className="absolute inset-0 flex flex-col justify-end p-8">
                                <h3 className="text-white text-3xl font-bold tracking-tight mb-1 transform transition-transform duration-300 group-hover:-translate-y-2">
                                    Explore {category.title}
                                </h3>

                                <div className="overflow-hidden">
                <span
                    className="inline-block text-white text-sm font-semibold uppercase tracking-[0.2em] border-b border-white pb-1 transform translate-y-12 transition-transform duration-500 group-hover:translate-y-0">
                  Discover Collection
                </span>
                                </div>
                            </div>
                        </Link>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}
