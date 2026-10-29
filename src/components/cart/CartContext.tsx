"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const STORAGE_KEY = "antiqua_cart_v1";

interface CartState {
  items: string[];
  count: number;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (next: string[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("antiqua-cart-update"));
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    const sync = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", sync);
    window.addEventListener("antiqua-cart-update", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("antiqua-cart-update", sync);
    };
  }, []);

  const add = (productId: string) =>
    persist(Array.from(new Set([...items, productId])));
  const remove = (productId: string) =>
    persist(items.filter((id) => id !== productId));
  const clear = () => persist([]);
  const has = (productId: string) => items.includes(productId);

  return (
    <CartContext.Provider
      value={{ items, count: items.length, add, remove, clear, has }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}