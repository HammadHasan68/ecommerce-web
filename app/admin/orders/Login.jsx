"use client";

import { useState } from "react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                // cookie set by server; reload so server-rendered page can see it
                window.location.reload();
            } else {
                setError("Invalid credentials");
                setLoading(false);
            }
        } catch (err) {
            setError("Network error");
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#050507] px-5 py-10 text-white">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-violet-950/30 backdrop-blur-xl sm:p-10">
                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                    <div className="text-center">
                        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-purple-500 text-sm font-bold text-white">M</span>
                        <h2 className="mt-5 text-2xl font-semibold">Admin login</h2>
                        <div className="mt-3 text-sm leading-6 text-zinc-400">Sign in to manage completed orders.</div>
                    </div>

                    <div className="mt-2">
                        <label className="block text-sm font-medium text-zinc-300">Username</label>
                        <input autoFocus value={username} onChange={e => setUsername(e.target.value)} className="mt-1 block w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10" placeholder="Enter username" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-300">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10" placeholder="Enter password" />
                    </div>

                    {error && <div className="text-sm text-red-300">{error}</div>}

                    <div>
                        <button disabled={loading} type="submit" className="inline-flex w-full justify-center rounded-xl bg-linear-to-r from-violet-600 to-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-purple-400 disabled:cursor-not-allowed disabled:opacity-70">
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
