import Link from 'next/link';
import {Reveal} from "@/components/ui/Reveal";

export default function HeroVideo() {
    return (
        <Reveal
            fade={true}
            className="relative w-full h-[80dvh] mt-4 md:aspect-video md:h-auto overflow-hidden rounded-2xl shadow-2xl ">
            <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="/video-placeholder.jpg"
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="/videos/hero-optimized.webm" type="video/webm"/>
                <source src="/videos/hero-optimized.mp4" type="video/mp4"/>
            </video>

            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/20 to-transparent"/>

            <div className="absolute inset-0 flex flex-col justify-end items-start p-8 md:p-16 lg:p-20">
                <div className="max-w-2xl">
                    <h1 className="text-white text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-4 drop-shadow-sm">
                        Elevate Your <br/> Living Space
                    </h1>

                    <p className="text-gray-200 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
                        Experience the perfect blend of artisanal craftsmanship and
                        contemporary minimalist design.
                    </p>

                    <Link
                        href="/shop"
                        className="inline-block bg-white text-neutral-900 text-[0.9rem] px-7 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all duration-300 transform active:scale-95"
                    >
                        Explore Collection
                    </Link>
                </div>
            </div>
        </Reveal>
    );
}
