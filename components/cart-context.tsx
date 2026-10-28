"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CartLine,
  MenuItem,
  hasSpiceOption,
  sideOptions,
} from "@/lib/menu";
import { track } from "@/lib/analytics";
import { BASE_PATH } from "@/lib/assets";

export interface CartConfig {
  variation: string;
  unitBasePrice: number;
  quantity: number;
  spice: string;
  side: string;
  sidePrice: number;
  notes: string;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  activeItem: MenuItem | null;
  /** Size index the customizer opens on (a size tapped on the card). */
  activeVariation: number;
  cartOpen: boolean;
  configureItem: (item: MenuItem, variationIdx?: number) => void;
  closeItem: () => void;
  addConfiguredItem: (item: MenuItem, cfg: CartConfig) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  /** Validate, create a Square checkout link and go to it. Resolves to an error message, or null on success. */
  checkout: (order: { isDelivery: boolean; address: string; time: string }) => Promise<string | null>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}

const STORAGE_KEY = "sobajo-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [activeVariation, setActiveVariation] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore a previous cart (small persistence upgrade over the demo).
  useEffect(() => {
    // Back from a paid Square checkout: drop the saved cart and tidy the URL.
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // storage may be unavailable
      }
      params.delete("checkout");
      const qs = params.toString();
      window.history.replaceState(null, "", window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash);
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setLines(parsed as CartLine[]);
      }
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage may be unavailable
    }
  }, [lines, hydrated]);

  // Lock page scroll while a modal is open.
  useEffect(() => {
    document.body.classList.toggle("no-scroll", activeItem !== null || cartOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [activeItem, cartOpen]);

  const count = lines.length; // demo counted line entries, not total quantity

  const subtotal = useMemo(() => lines.reduce((sum, l) => sum + l.price, 0), [lines]);

  const configureItem = useCallback((item: MenuItem, variationIdx = 0) => {
    setCartOpen(false);
    setActiveVariation(variationIdx);
    setActiveItem(item);
    track("view_item", { items: [{ item_name: item.name, item_category: item.section }] });
  }, []);

  const closeItem = useCallback(() => setActiveItem(null), []);

  const addConfiguredItem = useCallback((item: MenuItem, cfg: CartConfig) => {
    setLines((prev) => [
      ...prev,
      {
        id: (prev[prev.length - 1]?.id ?? 0) + 1,
        name: item.name,
        variation: cfg.variation,
        unitPrice: cfg.unitBasePrice,
        quantity: cfg.quantity,
        price: cfg.unitBasePrice * cfg.quantity,
        spice: cfg.spice,
        side: cfg.side,
        notes: cfg.notes,
      },
    ]);
    track("add_to_cart", {
      value: cfg.unitBasePrice * cfg.quantity,
      items: [{ item_name: item.name, item_variant: cfg.variation, item_category: item.section, price: cfg.unitBasePrice, quantity: cfg.quantity }],
    });
    setActiveItem(null);
  }, []);

  const removeItem = useCallback((id: number) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const openCart = useCallback(() => {
    setActiveItem(null);
    setCartOpen(true);
  }, []);

  const closeCart = useCallback(() => setCartOpen(false), []);

  const checkout = useCallback(
    async (order: { isDelivery: boolean; address: string; time: string }) => {
      const { isDelivery, address, time } = order;
      if (!lines.length) return "Please add at least one item.";
      if (isDelivery && !address.trim()) return "Please enter a delivery address.";
      track("begin_checkout", {
        value: subtotal,
        fulfillment: isDelivery ? "delivery" : "pickup",
        items: lines.map((l) => ({ item_name: l.name, item_variant: l.variation, price: l.unitPrice, quantity: l.quantity })),
      });
      try {
        const res = await fetch(`${BASE_PATH}/api/checkout/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lines: lines.map(({ name, variation, quantity, spice, side, notes }) => ({ name, variation, quantity, spice, side, notes })),
            fulfillment: isDelivery ? "delivery" : "pickup",
            address,
            time,
          }),
        });
        const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
        if (!res.ok || !data.url) return data.error ?? "We couldn't start checkout. Please try again.";
        window.location.assign(data.url);
        return null;
      } catch {
        return "Network error — please check your connection and try again.";
      }
    },
    [lines, subtotal]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count,
      subtotal,
      activeItem,
      activeVariation,
      cartOpen,
      configureItem,
      closeItem,
      addConfiguredItem,
      removeItem,
      clearCart,
      openCart,
      closeCart,
      checkout,
    }),
    [
      lines,
      count,
      subtotal,
      activeItem,
      activeVariation,
      cartOpen,
      configureItem,
      closeItem,
      addConfiguredItem,
      removeItem,
      clearCart,
      openCart,
      closeCart,
      checkout,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { hasSpiceOption, sideOptions };
