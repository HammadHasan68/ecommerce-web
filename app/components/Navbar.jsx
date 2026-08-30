"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";

export default function Navbar() {
    const pathname = usePathname();
    const { itemCount } = useCart();
    const [open, setOpen] = useState(false);

    const links = [
        { href: "/products", label: "Products" },
        { href: "/about", label: "About" },
        { href: "/checkout", label: "Checkout" },
    ];

    return (
        <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#050507]/75 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-8 lg:px-10">
                <Link href="/products" className="group flex shrink-0 items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-400 text-sm font-bold tracking-tight text-white shadow-lg shadow-violet-500/25 transition-transform duration-300 group-hover:rotate-6">M</span>
                    <span className="text-base font-semibold tracking-[-0.02em] text-white transition-colors group-hover:text-violet-300 sm:text-lg">
                        ModernShop
                    </span>
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${pathname === l.href
                                    ? "text-white after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-violet-400"
                                    : "text-zinc-400 hover:text-violet-300"
                                }`}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <Link href="/checkout" aria-label={`Cart${itemCount ? `, ${itemCount} items` : ""}`} className="group relative rounded-xl p-2 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9v9"
                            />
                        </svg>

                        {itemCount > 0 && (
                            <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-violet-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-violet-500/40">
                                {itemCount}
                            </span>
                        )}
                    </Link>

                    <button
                        onClick={() => setOpen((s) => !s)}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:border-violet-400/40 hover:bg-violet-500/10 md:hidden"
                        aria-label="Toggle menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="border-t border-white/10 bg-[#0b0a10]/95 md:hidden">
                    <div className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:px-10">
                        <div className="flex flex-col gap-1 py-1">
                            {links.map((l) => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    className={`rounded-xl px-3 py-3 text-sm font-medium transition-colors ${pathname === l.href ? "bg-violet-500/15 text-violet-200" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
