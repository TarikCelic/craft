"use client";

import Footer from "@/components/Footer";
import {useEffect, useState} from "react";
import Image from "next/image";
import Navigation from "@/components/navigation/Navigation";
import {Reveal} from "@/components/ui/Reveal";
import Link from "next/link";

const stats = [
    {number: "2009", label: "Founded"},
    {number: "140+", label: "Stores worldwide"},
    {number: "2.4M", label: "Happy homes"},
    {number: "38", label: "Countries"},
];

const values = [
    {
        title: "Craftsmanship",
        desc: "Every piece we make is designed to last. We believe furniture should outlive trends — built with intention, not just speed.",
    },
    {
        title: "Accessibility",
        desc: "Beautiful living shouldn't be a privilege. CRAFT exists to make thoughtfully designed homes available to everyone.",
    },
    {
        title: "Honesty",
        desc: "No hidden costs, no flimsy materials dressed up in marketing. What you see is what you get — and it's good.",
    },
];

export default function AboutPage() {


    return (
        <div>
            <Navigation/>
            <main className="bg-[#f8f7f4] text-[#1a1a1a] min-h-screen">
                <div className="grid grid-cols-1 md:grid-cols-2 min-h-[88vh]">
                    <Reveal direction={"fromLeft"}
                            className={`flex flex-col justify-center px-8 py-16 md:px-16 md:py-24 transition-all duration-700 ease-out `}>
                        <p className="text-xs tracking-[0.25em] text-blue-500 font-sans font-semibold mb-8 uppercase">
                            The man behind the brand
                        </p>
                        <h1 className="leading-[1.1] tracking-tight mb-8 text-6xl font-semibold">
                            Tarik
                            <em className="text-blue-500 not-italic"> Čelić</em>
                        </h1>
                        <p className="text-lg leading-relaxed text-neutral-500 max-w-md font-sans font-light mb-12">
                            Founder &amp; Creative Director of CRAFT. Born in Gornji Vakuf -
                            Uskoplje, Bosnia. Raised between two worlds — the warmth of the
                            Balkans and the clean lines of Scandinavian design.
                        </p>
                        <div className="w-12 h-[3px] bg-blue-500 rounded-full"/>
                    </Reveal>
                    <Reveal direction={"fromRight"} className="bg-blue-500 min-h-[40vh] md:min-h-0 relative ">
                        <Image
                            src="/tarikcelicteam.png"
                            alt="tarikcelic"
                            fill
                            className="object-cover"
                        />
                    </Reveal>
                </div>

                <section className="grid grid-cols-2 sm:grid-cols-4 border-t border-b border-neutral-200 bg-white">
                    {stats.map((s, i) => (
                        <div
                            key={i}
                            className={`py-10 px-6 text-center ${
                                i % 2 === 0 ? "border-r border-neutral-200" : ""
                            } ${i < 2 ? "border-b border-neutral-200 sm:border-b-0" : ""} ${
                                i === 1 || i === 2 ? "sm:border-r sm:border-neutral-200" : ""
                            }`}
                        >
                            <div className="text-4xl font-bold text-blue-500 tracking-tight mb-1">
                                {s.number}
                            </div>
                            <div className="text-[0.7rem] tracking-[0.18em] text-neutral-400 font-sans uppercase">
                                {s.label}
                            </div>
                        </div>
                    ))}
                </section>

                <section
                    className="grid grid-cols-1 md:grid-cols-[1fr_2fr] max-w-[1300px] mx-auto px-8 py-16 md:px-8 md:py-28 gap-8 md:gap-16 ">
                    <Reveal direction={"fromLeft"} className="flex flex-col gap-6 ">
                        <p className="text-xs tracking-[0.25em] text-blue-500 font-sans font-semibold uppercase">
                            The story
                        </p>
                        <div className="relative w-150 h-full overflow-hidden">
                            <Image
                                src="/taresarajvo.jpeg"
                                alt="tarikcelic"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </Reveal>
                    <Reveal direction={"fromRight"} className={""}>
                        <h2 className="text-[clamp(1.8rem,3.5vw,2.4rem)] leading-snug tracking-tight mb-10">
                            A workshop in Sarajevo. A dream{" "}
                            <em className="text-blue-500">too big for one country.</em>
                        </h2>
                        <div
                            className="font-sans font-light text-[1.05rem] leading-[1.95] text-neutral-500 flex flex-col gap-6">
                            <p>
                                Tarik Čelić grew up in Gornji Vakuf - Uskoplje, a small town in
                                Bosnia where craftsmanship wasn't a brand value — it was simply
                                how things were done. His grandfather built furniture by hand in
                                a shed behind the house. His mother sewed curtains for half the
                                neighbourhood. Making things well, and making them last, was the
                                family language.
                            </p>
                            <p>
                                At 22, Tarik left Bosnia on a design scholarship to Stockholm.
                                He fell in love with Nordic functionalism — the idea that
                                beautiful design shouldn't require a beautiful budget. But he
                                noticed something missing in Scandinavian interiors: soul.
                                Warmth. The sense that a home had a story behind it. He wanted
                                to bring both worlds together.
                            </p>
                            <p>
                                In 2009, with €12,000 in savings and a small warehouse in
                                Sarajevo, he launched CRAFT. The first collection was 14 pieces.
                                Within eight months, every piece had sold out across the region.
                                By 2013, CRAFT opened its first international store in Vienna.
                                By 2018, they were in 38 countries.
                            </p>
                            <blockquote className="border-l-[3px] border-blue-500 pl-6 text-[#1a1a1a] text-[1.15rem]">
                                <p className="italic">
                                    "I never wanted CRAFT to be a luxury brand. I wanted it to be
                                    the brand people are proud to walk into — and even prouder to
                                    live with."
                                </p>
                                <cite className="not-italic text-sm text-neutral-400 font-sans block mt-3">
                                    — Tarik Čelić, Founder
                                </cite>
                            </blockquote>
                            <p>
                                Today, CRAFT employs over 11,000 people across Europe and the
                                Middle East. The headquarters remains in Sarajevo — a deliberate
                                choice. Tarik still walks the factory floor every Tuesday
                                morning.
                            </p>
                        </div>
                    </Reveal>
                </section>

                <section className="bg-white py-16 px-8 md:py-24 md:px-16">
                    <div className="max-w-6xl mx-auto">
                        <p className="text-xs tracking-[0.25em] text-blue-500 font-sans font-semibold uppercase mb-14">
                            What we stand for
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                            {values.map((v, i) => (
                                <Reveal key={i} direction={"fromDown"} delay={i * 150} className={""}>
                                    <div className="w-8 h-[2px] bg-blue-500 mb-6"/>
                                    <h3 className="text-[1.3rem] tracking-tight mb-4">
                                        {v.title}
                                    </h3>
                                    <p className="text-[0.95rem] leading-[1.85] text-neutral-500 font-sans font-light">
                                        {v.desc}
                                    </p>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                <Reveal className="bg-[#1e3a5f] py-16 px-8 text-center md:py-24 md:px-16 ">
                    <h2 className="text-[clamp(2rem,4vw,2.8rem)] text-white tracking-tight mb-6">
                        Home is where <em className="text-blue-300">craft</em> lives.
                    </h2>
                    <p className="text-blue-300 text-base font-sans font-light tracking-widest mb-12">
                        Explore our latest collections.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-block px-10 py-4 md:px-12 border border-blue-500 text-white text-xs tracking-[0.2em] font-sans font-semibold uppercase hover:bg-blue-500 transition-colors duration-200"
                    >
                        Shop now
                    </Link>
                </Reveal>
            </main>
            <Footer className="!rounded-none !mt-0"/>
        </div>
    );
}
