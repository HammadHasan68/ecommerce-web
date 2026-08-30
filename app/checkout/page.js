"use client";

import { useMemo, useState } from "react";
import { useCart } from "../components/CartProvider";
import Link from "next/link";

export default function Checkout() {
    const { items, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
    const [coupon, setCoupon] = useState("");
    const [shipping, setShipping] = useState(5.0);
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postal: "",
    });

    const discount = coupon.trim().toUpperCase() === "SAVE10" ? 0.1 : 0;

    const total = useMemo(() => {
        const sub = subtotal || 0;
        const disc = sub * (discount || 0);
        return Math.max(0, sub - disc + (items.length ? shipping : 0));
    }, [subtotal, discount, shipping, items.length]);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        // basic validation
        if (!items.length) return;
        if (!form.fullName || !form.email || !form.address) {
            alert("Please fill required fields: name, email, address");
            return;
        }

        setLoading(true);

        try {
            // Send order to server
            const payload = {
                items: items.map(i => ({ _id: i._id, title: i.title, price: i.price, quantity: i.quantity, image: i.image })),
                subtotal,
                shipping,
                discount,
                total,
                customer: form,
            };

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Order failed");
            }

            setConfirmed(true);
            clearCart();
        } catch (err) {
            alert("Something went wrong placing your order.");
        } finally {
            setLoading(false);
        }
    };

    if (confirmed) {
        return (
            <main className="min-h-screen bg-[#050507] text-[#f8fafc]"><section className="mx-auto max-w-3xl px-5 py-20 sm:px-8"><div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl shadow-violet-950/20 backdrop-blur-xl sm:p-16"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-violet-600 to-purple-500 text-2xl text-white shadow-lg shadow-violet-500/30">✓</div><h2 className="mt-6 text-3xl font-semibold tracking-[-0.03em]">Order confirmed</h2><p className="mx-auto mt-4 max-w-md text-sm leading-7 text-zinc-400">Thank you for your purchase. A confirmation email is on its way.</p><Link href="/products" className="mt-8 inline-flex rounded-xl bg-linear-to-r from-violet-600 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-purple-400">Continue shopping</Link></div>
                </section>
            </main>
        );
    }

    if (!items || items.length === 0) {
        return (
            <main className="min-h-screen bg-[#050507] text-[#f8fafc]"><section className="mx-auto max-w-3xl px-5 py-20 sm:px-8"><div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl shadow-violet-950/20 backdrop-blur-xl sm:p-16"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">Nothing here yet</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">Your cart is empty</h2><p className="mt-4 text-sm text-zinc-400">Looks like you have not added anything yet.</p><Link href="/products" className="mt-8 inline-flex rounded-xl bg-linear-to-r from-violet-600 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-purple-400">Continue shopping</Link></div>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#050507] text-[#f8fafc]">
            <section className="mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 lg:px-10 lg:pt-16">
                <div className="mb-10"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">Almost yours</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">Checkout</h1><p className="mt-3 text-sm text-zinc-400">Complete your details and we will take care of the rest.</p></div>
                <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-start">
                    <div>
                        <h2 className="text-xl font-semibold">Customer information</h2>
                        <form onSubmit={handlePlaceOrder} className="mt-6 space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-300">Full name *</label>
                                <input value={form.fullName} onChange={(e) => setForm(f => ({ ...f, fullName: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition backdrop-blur-xl focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10" required />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-300">Email *</label>
                                <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition backdrop-blur-xl focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10" required />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-300">Phone</label>
                                <input value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition backdrop-blur-xl focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10" />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-300">Shipping address *</label>
                                <input value={form.address} onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition backdrop-blur-xl focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10" required />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-zinc-300">City</label>
                                    <input value={form.city} onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition backdrop-blur-xl focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10" />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-zinc-300">Postal code</label>
                                    <input value={form.postal} onChange={(e) => setForm(f => ({ ...f, postal: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition backdrop-blur-xl focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10" />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-300">Payment method</label>
                                <select className="w-full rounded-xl border border-white/10 bg-[#0b0a10] px-4 py-3 text-sm text-white outline-none focus:border-violet-400/50">
                                    <option>Card (demo)</option>
                                    <option>PayPal</option>
                                </select>
                            </div>

                            <div>
                                <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5 hover:from-violet-500 hover:to-purple-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60">
                                    {loading ? "Placing order..." : "Place Order"}
                                </button>
                            </div>
                        </form>
                    </div>

                    <aside>
                        <h3 className="text-xl font-semibold">Order summary</h3>
                        <div className="mt-4 space-y-4">
                            {items.map((it) => (
                                <div key={it._id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
                                    <img src={it.image || "https://placehold.co/120x80"} alt={it.title} className="h-16 w-24 rounded-md object-cover" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                                            <div>
                                                <div className="text-sm font-semibold">{it.title}</div>
                                                <div className="mt-1 text-sm text-zinc-400">${Number(it.price || 0).toFixed(2)}</div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button type="button" onClick={() => updateQuantity(it._id, Math.max(1, (it.quantity || 1) - 1))} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition hover:border-violet-400/40">-</button>
                                                <div className="w-8 text-center">{it.quantity}</div>
                                                <button type="button" onClick={() => updateQuantity(it._id, (it.quantity || 1) + 1)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition hover:border-violet-400/40">+</button>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between">
                                            <button type="button" onClick={() => removeFromCart(it._id)} className="text-sm font-semibold text-[#b85d40] transition hover:text-[#82412e]">Remove</button>
                                            <div className="text-sm font-semibold">${((Number(it.price || 0)) * (it.quantity || 0)).toFixed(2)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/10 backdrop-blur-xl">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-zinc-400">Subtotal</div>
                                    <div className="font-semibold">${subtotal.toFixed(2)}</div>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <div className="text-sm text-zinc-400">Shipping</div>
                                    <div className="font-semibold">${items.length ? shipping.toFixed(2) : "0.00"}</div>
                                </div>

                                <div className="mt-3">
                                    <label className="mb-1 block text-sm font-medium text-zinc-300">Discount / coupon</label>
                                    <div className="flex gap-2">
                                        <input value={coupon} onChange={(e) => setCoupon(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-violet-400/50" placeholder="Enter code" />
                                        <button type="button" onClick={() => { }} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:border-violet-400/30 hover:bg-violet-500/10">Apply</button>
                                    </div>
                                    {discount > 0 && <div className="mt-2 text-sm text-[#46735e]">Coupon applied ({Math.round(discount * 100)}% off)</div>}
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                                    <div className="text-sm font-semibold">Total</div>
                                    <div className="text-xl font-bold">${total.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}
