"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "../components/CartProvider";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [searchError, setSearchError] = useState("");
    const [category, setCategory] = useState("All");

    const { addToCart } = useCart();

    const categories = useMemo(() => [
        "All",
        ...new Set(products.map((product) => product.category || "General")),
    ], [products]);

    const visibleProducts = useMemo(
        () => category === "All"
            ? products
            : products.filter((product) => (product.category || "General") === category),
        [category, products]
    );

    // Fetch all products when page loads
    useEffect(() => {
        let cancelled = false;

        const loadProducts = async () => {
            try {
                const res = await fetch("/api/product");

                if (!res.ok) {
                    throw new Error("Unable to load products");
                }

                const data = await res.json();

                if (!cancelled) {
                    setProducts(Array.isArray(data) ? data : []);
                    setError("");
                    setLoading(false);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Something went wrong"
                    );
                    setLoading(false);
                }
            }
        };

        loadProducts();

        return () => {
            cancelled = true;
        };
    }, []);

    // Search products
    const handleSearch = async () => {
        setSearchError("");
        setError("");

        // If search box is empty, fetch all products
        if (!query.trim()) {
            setLoading(true);

            try {
                const res = await fetch("/api/product");

                if (!res.ok) {
                    throw new Error("Unable to load products");
                }

                const data = await res.json();

                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong"
                );
            } finally {
                setLoading(false);
            }

            return;
        }

        try {
            setSearching(true);

            const res = await fetch("/api/aisearch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: query.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setProducts([]);
                setSearchError(
                    data.message ||
                    "Something went wrong with AI search"
                );
                return;
            }

            setProducts(
                Array.isArray(data.products)
                    ? data.products
                    : []
            );

            // Show notice if AI fallback happened (e.g. quota ran out)
            if (data.notice) {
                setSearchError(data.notice);
            }
        } catch (err) {
            setProducts([]);
            setSearchError(
                "Something went wrong. Please try again."
            );
        } finally {
            setSearching(false);
        }
    };

    return (
        <main className="min-h-screen overflow-x-hidden bg-[#050507] text-[#f8fafc]">
            <section className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8 sm:pt-12 lg:px-10">
                <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-[#0b0a10]/90 px-6 py-12 shadow-2xl shadow-violet-950/20 sm:px-12 sm:py-16 lg:px-16">
                    <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
                    <div className="absolute -bottom-32 right-1/3 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl" />
                    <div className="relative max-w-2xl animate-[fade-up_600ms_ease-out_both]">
                        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">The next expression of everyday</p>
                        <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl"><span className="bg-linear-to-r from-violet-300 via-purple-400 to-[#ddd6fe] bg-clip-text text-transparent">Good things,</span><br /> made for living.</h1>
                        <p className="mt-6 max-w-lg text-sm leading-7 text-zinc-400 sm:text-base">Useful objects with a quiet point of view. Explore pieces chosen for the way they look, work, and last.</p>
                        <a href="#collection" className="mt-8 inline-flex items-center gap-3 rounded-xl bg-linear-to-r from-violet-600 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-purple-400 hover:shadow-violet-500/40 active:scale-95">Explore the collection <span aria-hidden="true">↓</span></a>
                    </div>
                </div>

                <div id="collection" className="mt-14 flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">Curated in the dark</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">Find your next everyday favorite</h2>
                    </div>
                    <div className="relative w-full lg:max-w-sm">
                        <label htmlFor="product-search" className="sr-only">Search products</label>
                        <input id="product-search" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} type="search" placeholder="Search the collection" className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-5 pr-28 text-sm text-white outline-none backdrop-blur-xl transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10" />
                        <button onClick={handleSearch} disabled={searching} className="absolute right-1 top-1 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60">{searching ? "Searching" : "Search"}</button>
                    </div>
                </div>

                {searchError && <div className="mt-5 rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-sm text-violet-200">{searchError}</div>}

                <div className="mt-7 flex items-start justify-between gap-4">
                    <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                        {categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`min-w-0 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 sm:px-4 ${category === item ? "border-violet-400/50 bg-violet-500/20 text-violet-200 shadow-lg shadow-violet-500/10" : "border-white/10 bg-white/5 text-zinc-400 backdrop-blur-xl hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-200"}`}>{item}</button>)}
                    </div>
                    {!loading && !error && <p className="hidden shrink-0 pt-2 text-xs text-zinc-500 sm:block">{visibleProducts.length} {visibleProducts.length === 1 ? "piece" : "pieces"}</p>}
                </div>

                <div className="mt-8">
                    {loading ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/5"><div className="h-64 bg-white/10" /><div className="space-y-3 p-5"><div className="h-3 w-20 rounded bg-white/10" /><div className="h-5 w-3/4 rounded bg-white/10" /><div className="h-3 w-full rounded bg-white/10" /></div></div>)}</div>
                        : error ? <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-10 text-center text-sm text-red-200">{error}</div>
                            : visibleProducts.length === 0 ? <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl"><p className="text-lg font-semibold">Nothing matched that search.</p><p className="mt-2 text-sm text-zinc-400">Try a different phrase or browse every piece.</p><button onClick={() => { setQuery(""); setCategory("All"); handleSearch(); }} className="mt-5 text-sm font-semibold text-violet-300 underline underline-offset-4">View all products</button></div>
                                : <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{visibleProducts.map((product, index) => <article key={product._id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-violet-400/40 hover:bg-violet-500/10 hover:shadow-[0_0_40px_rgba(124,58,237,0.18)]" style={{ animation: `fade-up 500ms ease-out ${index * 70}ms both` }}><div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-violet-400 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" /><div className="relative overflow-hidden bg-[#151021]"><img src={product.image || "https://placehold.co/600x400?text=Product"} alt={product.title || "Product"} className="h-64 w-full object-cover" /><span className="absolute left-4 top-4 rounded-lg border border-white/10 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-200 backdrop-blur-xl">{product.category || "General"}</span></div><div className="p-5"><div className="flex items-start justify-between gap-4"><h3 className="text-lg font-semibold leading-tight tracking-[-0.02em] text-white">{product.title}</h3><span className="shrink-0 text-base font-bold text-violet-300">${Number(product.price || 0).toFixed(2)}</span></div><p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-400">{product.description}</p><button onClick={() => addToCart(product)} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-purple-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/15 transition-all duration-200 hover:-translate-y-0.5 hover:from-violet-500 hover:to-purple-400 hover:shadow-violet-500/35 active:scale-95">Add to cart <span className="text-violet-200">+</span></button></div></article>)}</div>}
                </div>
            </section>
        </main>
    );
}
