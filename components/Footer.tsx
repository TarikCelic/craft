import Link from "next/link";
import Logo from "./ui/Logo";
import {ArrowUpRight} from "lucide-react";
import {Reveal} from "@/components/ui/Reveal";

const InstagramIcon = ({size = 18}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
);
const FacebookIcon = ({size = 18}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
);
const XIcon = ({size = 18}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
    </svg>
);
const YoutubeIcon = ({size = 18}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path
            d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
    </svg>
);

const SOCIAL_LINKS = [
    {name: "Instagram", Icon: InstagramIcon, href: "https://instagram.com"},
    {name: "Facebook", Icon: FacebookIcon, href: "https://facebook.com"},
    {name: "X", Icon: XIcon, href: "https://x.com"},
    {name: "Youtube", Icon: YoutubeIcon, href: "https://youtube.com"},
];

const FOOTER_LINKS = [
    {
        title: "Shop",
        links: [
            {name: "All Products", href: "/shop"},
            {name: "Kitchen Collection", href: "/shop/kitchen"},
            {name: "Office Furniture", href: "/shop/office"},
            {name: "Bedroom Series", href: "/shop/bedroom"},
        ],
    },
    {
        title: "Support",
        links: [
            {name: "Order Tracking", href: "/orders"},
            {name: "Shipping Policy", href: "/shipping"},
            {name: "Returns & Refunds", href: "/returns"},
            {name: "FAQs", href: "/faq"},
        ],
    },
    {
        title: "Company",
        links: [
            {name: "Our Story", href: "/about"},
            {name: "Craftsmanship", href: "/craft"},
            {name: "Sustainability", href: "/nature"},
            {name: "Contact Us", href: "/contact"},
        ],
    },
];

export default function Footer({className}: { className?: string }) {
    return (
        <Reveal
            fade
            className={`w-full bg-neutral-950 rounded-t-3xl text-neutral-400 pt-20 pb-10 px-10 mt-20 ${className} `}
        >
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
                    <div className="lg:col-span-2">
                        <Link
                            href="/"
                            className="inline-block transition-opacity hover:opacity-70 invert mb-8"
                        >
                            <Logo/>
                        </Link>
                        <p className="max-w-sm mb-10 leading-relaxed text-lg">
                            Redefining contemporary living through artisanal precision and
                            sustainable materials. Join our journey towards a more beautiful
                            home.
                        </p>
                        <div className="flex gap-4">
                            {SOCIAL_LINKS.map(({Icon, href, name}) => (
                                <a
                                    key={name}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={name}
                                    className="w-11 h-11 rounded-full border border-neutral-800 flex items-center justify-center hover:bg-white hover:text-neutral-900 hover:border-white transition-all duration-300"
                                >
                                    <Icon size={20}/>
                                </a>
                            ))}
                        </div>
                    </div>

                    {FOOTER_LINKS.map((group) => (
                        <div key={group.title}>
                            <h4 className="text-white font-bold uppercase tracking-[0.2em] text-[10px] mb-8">
                                {group.title}
                            </h4>
                            <ul className="space-y-4">
                                {group.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="group flex items-center gap-1 hover:text-white transition-colors duration-200 text-[15px]"
                                        >
                                            <span>{link.name}</span>
                                            <ArrowUpRight
                                                size={14}
                                                className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-neutral-500"
                                            />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-neutral-900 pt-10">
                    <div
                        className="flex justify-between w-full items-center md:items-start gap-3 text-xs tracking-wide">
                        <p>
                            &copy; {new Date().getFullYear()} ModernCraft Studio. All rights
                            reserved.
                        </p>
                        <div className="flex gap-8">
                            <Link
                                href="/privacy"
                                className="hover:text-white transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
                                className="hover:text-white transition-colors"
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Reveal>
    );
}
