"use client";

import { useState } from "react";

export default function DeleteOrderButton({ orderId, token }) {
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        if (!window.confirm("Delete this order? This action cannot be undone.")) {
            return;
        }

        setDeleting(true);
        const tokenQuery = token ? `&token=${encodeURIComponent(token)}` : "";

        try {
            const response = await fetch(`/api/orders?id=${encodeURIComponent(orderId)}${tokenQuery}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Delete failed");
            }

            window.location.reload();
        } catch {
            window.alert("Unable to delete the order. Please try again.");
            setDeleting(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-full border border-[#e7b8aa] px-3 py-2 text-sm font-semibold text-[#b85d40] transition hover:border-[#b85d40] hover:bg-[#f8e9e3] disabled:cursor-not-allowed disabled:opacity-60"
        >
            {deleting ? "Deleting..." : "Delete"}
        </button>
    );
}