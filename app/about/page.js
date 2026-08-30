"use client";

import Link from "next/link";

export default function About() {
    return (
        <main className="min-h-screen bg-[#050507] text-[#f8fafc]">
            <section className="mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 lg:px-10 lg:pt-20">
                <div className="max-w-3xl animate-[fade-up_600ms_ease-out_both]">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">A little more about us</p>
                    <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl"><span className="bg-linear-to-r from-violet-300 via-purple-400 to-[#ddd6fe] bg-clip-text text-transparent">Objects</span> with a reason to be.</h1>
                    <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400">ModernShop is a considered collection of useful, beautifully made things. We believe the objects around us should make daily life feel a little more deliberate.</p>
                </div>

                <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-20">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Our point of view</p>
                        <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">Less noise. Better choices.</h2>
                        <p className="mt-5 text-sm leading-7 text-zinc-400">What started as a small studio has become a curated collection designed to simplify daily routines. We obsess over the details that matter: durable materials, honest prices, and forms that feel good to use.</p>
                        <div className="mt-8 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-2">
                            {[["01", "Design with intention"], ["02", "Build to last"], ["03", "Price with honesty"], ["04", "Care about the experience"]].map(([number, value]) => <div key={number} className="flex gap-3"><span className="text-xs font-bold text-violet-300">{number}</span><span className="text-sm font-semibold">{value}</span></div>)}
                        </div>
                        <Link href="/products" className="mt-9 inline-flex items-center gap-3 rounded-xl bg-linear-to-r from-violet-600 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-purple-400 active:scale-95">Browse the collection <span aria-hidden="true">→</span></Link>
                    </div>
                    <div className="relative overflow-hidden rounded-4xl border border-violet-400/20 bg-violet-500/10 p-3 shadow-2xl shadow-violet-950/30"><img src="https://placehold.co/800x600?text=Brand+Image" alt="A selection of ModernShop products" className="h-96 w-full rounded-3xl object-cover opacity-80 transition-transform duration-700 hover:scale-105 sm:h-128" /></div>
                </div>
            </section>
        </main>
    );
}
