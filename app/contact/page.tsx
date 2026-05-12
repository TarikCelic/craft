"use client";

import {useState} from "react";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/Footer";
import {toast} from "sonner";
import sendMessage from "@/data/contact/actions";
import getUser from "@/utils/getUser";
import {Reveal} from "@/components/ui/Reveal";
import Link from "next/link";

const channels = [
    {
        label: "Customer Support",
        value: "support@craftfurniture.com",
        note: "Order issues, returns, product questions",
    },
    {
        label: "Press & Media",
        value: "press@craftfurniture.com",
        note: "Media inquiries and collaboration",
    },
    {
        label: "B2B & Wholesale",
        value: "trade@craftfurniture.com",
        note: "Trade accounts and bulk orders",
    },
];

const offices = [
    {
        city: "Sarajevo",
        tag: "HQ",
        address: "Ferhadija 12, 71000 Sarajevo, BiH",
        hours: "Mon–Fri, 09:00–17:00",
    },
    {
        city: "Vienna",
        tag: "EU",
        address: "Mariahilfer Str. 88, 1060 Wien, Austria",
        hours: "Mon–Sat, 10:00–19:00",
    },
];

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const user = await getUser();
        const id = user?.id || undefined;
        await sendMessage(name, email, subject, message, id);
        toast.success("Message sent. We'll get back to you within 24 hours.");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setLoading(false);
    }

    return (
        <>
            <Navigation/>
            <main className="bg-[#f8f7f4] text-[#1a1a1a] min-h-screen font-sans antialiased">
                <Reveal direction={"fromUp"}
                        className="border-b border-neutral-200 bg-white px-8 py-16 md:px-16 md:py-24 ">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <p className="text-[10px] tracking-[0.25em] text-blue-500 font-semibold uppercase mb-4">
                                Get in touch
                            </p>
                            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1]">
                                We'd love to <em className="text-blue-500 not-italic">hear</em>{" "}
                                from you.
                            </h1>
                            <p className="text-neutral-400 font-light text-base max-w-sm leading-relaxed">
                                Whether it's a question, a collaboration, or just a hello — our
                                team is here.
                            </p>
                        </div>
                    </div>
                </Reveal>

                <section
                    className="max-w-6xl mx-auto px-8 py-16 md:px-8 md:py-24 grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16">
                    <Reveal direction={"fromLeft"} className="flex flex-col gap-12 ">
                        <div>
                            <p className="text-[10px] tracking-[0.25em] text-blue-500 font-semibold uppercase mb-6">
                                Contact channels
                            </p>
                            <div className="flex flex-col gap-6">
                                {channels.map((c) => (
                                    <div
                                        key={c.label}
                                        className="border-b border-neutral-200 pb-6 last:border-b-0"
                                    >
                                        <p className="text-[11px] tracking-[0.18em] text-neutral-400 uppercase font-semibold mb-1">
                                            {c.label}
                                        </p>
                                        <a
                                            href={`mailto:${c.value}`}
                                            className="text-[#1a1a1a] font-light text-sm hover:text-blue-500 transition-colors"
                                        >
                                            {c.value}
                                        </a>
                                        <p className="text-neutral-400 text-xs font-light mt-1">
                                            {c.note}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] tracking-[0.25em] text-blue-500 font-semibold uppercase mb-6">
                                Our offices
                            </p>
                            <div className="flex flex-col gap-6">
                                {offices.map((o) => (
                                    <div key={o.city} className="flex gap-4 items-start">
                    <span
                        className="mt-[3px] text-[10px] font-bold tracking-widest text-blue-500 bg-blue-50 px-2 py-0.5 uppercase">
                      {o.tag}
                    </span>
                                        <div>
                                            <p className="font-semibold text-sm tracking-tight mb-0.5">
                                                {o.city}
                                            </p>
                                            <p className="text-neutral-400 text-xs font-light leading-relaxed">
                                                {o.address}
                                            </p>
                                            <p className="text-neutral-400 text-xs font-light">
                                                {o.hours}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>

                    <Reveal direction={"fromRight"} className="bg-white border border-neutral-200 p-8 md:p-10 ">
                        <p className="text-[10px] tracking-[0.25em] text-blue-500 font-semibold uppercase mb-8">
                            Send a message
                        </p>

                        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        placeholder="Name"
                                        className="peer w-full py-3 bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none transition-all placeholder-transparent text-sm"
                                    />
                                    <label
                                        htmlFor="name"
                                        className="absolute left-0 -top-3.5 text-slate-400 text-[10px] uppercase tracking-widest font-bold transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-300 peer-placeholder-shown:top-3 peer-placeholder-shown:font-light peer-placeholder-shown:capitalize peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-blue-500 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:font-bold"
                                    >
                                        Full Name
                                    </label>
                                </div>

                                <div className="relative">
                                    <input
                                        type="email"
                                        id="contact-email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="Email"
                                        className="peer w-full py-3 bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none transition-all placeholder-transparent text-sm"
                                    />
                                    <label
                                        htmlFor="contact-email"
                                        className="absolute left-0 -top-3.5 text-slate-400 text-[10px] uppercase tracking-widest font-bold transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-300 peer-placeholder-shown:top-3 peer-placeholder-shown:font-light peer-placeholder-shown:capitalize peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-blue-500 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:font-bold"
                                    >
                                        Email Address
                                    </label>
                                </div>
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    id="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                    placeholder="Subject"
                                    className="peer w-full py-3 bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none transition-all placeholder-transparent text-sm"
                                />
                                <label
                                    htmlFor="subject"
                                    className="absolute left-0 -top-3.5 text-slate-400 text-[10px] uppercase tracking-widest font-bold transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-300 peer-placeholder-shown:top-3 peer-placeholder-shown:font-light peer-placeholder-shown:capitalize peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-blue-500 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:font-bold"
                                >
                                    Subject
                                </label>
                            </div>

                            <div className="relative">
                <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    placeholder="Message"
                    className="peer w-full py-3 bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none transition-all placeholder-transparent resize-none text-sm"
                />
                                <label
                                    htmlFor="message"
                                    className="absolute left-0 -top-3.5 text-slate-400 text-[10px] uppercase tracking-widest font-bold transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-300 peer-placeholder-shown:top-3 peer-placeholder-shown:font-light peer-placeholder-shown:capitalize peer-placeholder-shown:tracking-normal peer-focus:-top-3.5 peer-focus:text-blue-500 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:font-bold"
                                >
                                    Your Message
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-500 py-5 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-900 transition-all duration-500 ease-in-out active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </button>

                            <p className="text-[11px] text-neutral-400 font-light text-center">
                                We typically respond within{" "}
                                <span className="text-neutral-600">24 hours</span> on business
                                days.
                            </p>
                        </form>
                    </Reveal>
                </section>

                <Reveal fade className="bg-[#1e3a5f] py-16 px-8 text-center md:py-24 md:px-16">
                    <h2 className="text-[clamp(2rem,4vw,2.8rem)] text-white tracking-tight mb-6">
                        Home is where <em className="text-blue-300">craft</em> lives.
                    </h2>
                    <p className="text-blue-300 text-base font-light tracking-widest mb-12">
                        Explore our latest collections.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-block px-10 py-4 md:px-12 border border-blue-500 text-white text-xs tracking-[0.2em] font-bold uppercase hover:bg-blue-500 transition-colors duration-200"
                    >
                        Shop now
                    </Link>
                </Reveal>
            </main>
            <Footer className="!rounded-none !mt-0"/>
        </>
    );
}
