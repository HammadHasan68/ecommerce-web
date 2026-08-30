import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Order from "@/models/order";
import Login from "./Login";
import DeleteOrderButton from "./DeleteOrderButton";

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const token = (params && params.token) || "";
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
    const cookieStore = await cookies();
    const hasAuthCookie = cookieStore.get("admin_auth")?.value === "1";

    if (!hasAuthCookie && (!ADMIN_TOKEN || token !== ADMIN_TOKEN)) {
        return <Login />;
    }

    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).limit(200).lean();

    return (
        <main className="min-h-screen bg-[#050507] text-[#f8fafc]">
            <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">Back office</p>
                <div className="mt-3 flex items-end justify-between gap-4"><div><h1 className="text-4xl font-semibold tracking-[-0.04em]">Orders</h1><p className="mt-2 text-sm text-zinc-400">Review recent purchases and clear fulfilled orders.</p></div><span className="hidden rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-200 sm:inline-flex">{orders.length} recent</span></div>

                <div className="mt-6 grid gap-4">
                    {orders.map((o) => (
                        <div key={o._id.toString()} className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/10 backdrop-blur-xl transition hover:border-violet-400/30 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-semibold">Order #{o._id.toString()}</div>
                                    <div className="mt-1 text-sm text-zinc-400">{new Date(o.createdAt).toLocaleString()}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-lg font-bold text-violet-300">${Number(o.total || 0).toFixed(2)}</div>
                                    <DeleteOrderButton orderId={o._id.toString()} token={token} />
                                </div>
                            </div>

                            <div className="mt-3 grid gap-2 md:grid-cols-2">
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#87908a]">Customer</div>
                                    <div className="mt-2 text-sm text-zinc-300">{o.customer?.fullName} — {o.customer?.email}</div>
                                    <div className="text-sm text-zinc-400">{o.customer?.address}, {o.customer?.city} {o.customer?.postal}</div>
                                </div>

                                <div>
                                    <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#87908a]">Items</div>
                                    <ul className="mt-2 text-sm text-zinc-400">
                                        {o.items.map(it => (
                                            <li key={it._id?.toString()} className="flex items-center justify-between">
                                                <span>{it.title} × {it.quantity}</span>
                                                <span className="font-semibold">${((it.price || 0) * (it.quantity || 0)).toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}




