"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function useCart() {
    return useContext(CartContext);
}

export default function CartProvider({ children }) {
    const [items, setItems] = useState([]);

    // load from localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem("cart:v1");
            if (raw) setItems(JSON.parse(raw));
        } catch (e) {
            // ignore
        }
    }, []);

    // persist
    useEffect(() => {
        try {
            localStorage.setItem("cart:v1", JSON.stringify(items));
        } catch (e) { }
    }, [items]);

    const addToCart = (product) => {
        setItems((prev) => {
            const existing = prev.find((p) => p._id === product._id);
            if (existing) {
                return prev.map((p) =>
                    p._id === product._id
                        ? { ...p, quantity: Math.min(99, (p.quantity || 1) + 1) }
                        : p
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setItems((prev) => prev.filter((p) => p._id !== id));
    };

    const updateQuantity = (id, qty) => {
        setItems((prev) =>
            prev.map((p) => (p._id === id ? { ...p, quantity: Math.max(0, qty) } : p))
        );
    };

    const clearCart = () => setItems([]);

    const itemCount = useMemo(() => items.reduce((s, it) => s + (it.quantity || 0), 0), [items]);

    const subtotal = useMemo(
        () => items.reduce((s, it) => s + (Number(it.price || 0) || 0) * (it.quantity || 0), 0),
        [items]
    );

    const value = {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
