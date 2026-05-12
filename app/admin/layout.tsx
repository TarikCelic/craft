'use client';

import {useState, useEffect} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {
    LayoutDashboard,
    Box,
    CirclePlus,
    Users,
    ShoppingBag,
    MessagesSquare,
    X,
    Menu,
} from 'lucide-react';
import Navigation from '@/components/navigation/Navigation';
import Image from 'next/image';
import {Reveal} from "@/components/ui/Reveal";

const NAV_ITEMS = [
    {label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20}/>},
    {label: 'Products', href: '/admin/products', icon: <Box size={20}/>},
    {label: 'Users', href: '/admin/users', icon: <Users size={20}/>},
    {label: 'Orders', href: '/admin/orders', icon: <ShoppingBag size={20}/>},
    {label: 'Messages', href: '/admin/messages', icon: <MessagesSquare size={20}/>},
    {label: 'Add Product', href: '/admin/add-product', icon: <CirclePlus size={20}/>, accent: true},
];

export default function AdminLayout({children}: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
        <div className="flex flex-col min-h-screen bg-[#0d0f14] text-[#e8eaf0]">
            <Navigation/>

            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 z-[99] bg-neutral-900/60 backdrop-blur-sm md:hidden"
                    aria-hidden="true"
                />
            )}

            <div className="flex flex-1 min-h-0">
                <Reveal direction={"fromLeft"}
                        aria-label="Sidebar navigation"
                        className={[
                            'fixed top-0 md:top-18 left-0 z-[100]',
                            'h-screen md:h-[calc(100vh-71px)]',
                            'w-[240px] shrink-0',
                            'bg-[#13161e] border-r border-white/[0.06]',
                            'flex flex-col overflow-y-auto overflow-x-hidden',
                            'transition-transform duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
                            open ? 'translate-x-0 shadow-[4px_0_32px_rgba(0,0,0,0.5)]' : '-translate-x-full',
                            'md:translate-x-0',
                        ].join(' ')}
                >
                    <div className="flex flex-col h-full px-3 py-5">
                        <div className="flex items-center gap-2.5 px-2 pb-5 mb-4 border-b border-white/[0.06]">
                            <div className="relative w-6 invert h-5">
                                <Image src={'/justC.png'} fill alt={''}/>
                            </div>
                            <span className="text-[15px] font-mono font-semibold tracking-tight">
                                ADMIN PANEL
                            </span>
                        </div>

                        <nav className="flex-1" aria-label="Main navigation">
                            <ul role="list" className="flex flex-col gap-0.5">
                                {NAV_ITEMS.map(({label, href, icon, accent}) => {
                                    const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
                                    return (
                                        <li key={href}>
                                            <Link
                                                href={href}
                                                aria-current={active ? 'page' : undefined}
                                                className={[
                                                    'flex items-center gap-2.5 px-3 py-[9px] rounded-lg',
                                                    'text-[13.5px] font-medium no-underline relative',
                                                    'transition-colors duration-200',
                                                    active
                                                        ? 'bg-[rgba(79,124,255,0.12)] text-[#4f7cff]'
                                                        : accent
                                                            ? 'text-[#22d3a0] hover:bg-[rgba(34,211,160,0.1)] mt-3'
                                                            : 'text-[#5c6178] hover:bg-[#1a1e29] hover:text-[#e8eaf0]',
                                                ].join(' ')}
                                            >
                                                <span className="flex items-center shrink-0" aria-hidden="true">
                                                    {icon}
                                                </span>
                                                <span className="flex-1">{label}</span>
                                                {active && (
                                                    <span
                                                        className="w-1.5 h-1.5 rounded-full bg-[#4f7cff] shrink-0"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>


                    </div>
                </Reveal>

                <button
                    onClick={() => setOpen((p) => !p)}
                    aria-label={open ? 'Close sidebar' : 'Open sidebar'}
                    aria-expanded={open}
                    className="md:hidden fixed bottom-5 right-5 z-[200] w-11 h-11 rounded-xl bg-[#4f7cff] text-white flex items-center justify-center hover:bg-[#3b6aff] hover:scale-105 active:scale-95 transition-all duration-200 border-0 cursor-pointer"
                >
                    {open ? <X size={20} strokeWidth={2.5}/> : <Menu size={20} strokeWidth={2.5}/>}
                </button>

                <main
                    id="main-content"
                    className="flex-1 min-w-0 overflow-y-auto bg-[#0d0f14] p-7 max-md:p-4 md:pl-70"
                >
                    {children}
                </main>
            </div>
        </div>
    );
}