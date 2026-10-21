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
  DELIVERY_FEE,
  DELIVERY_MINIMUM,
  MenuItem,
  hasSpiceOption,
  sideOptions,
  SQUARE_CHECKOUT_URL,
} from "@/lib/menu";

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
  cartOpen: boolean;
  configureItem: (item: MenuItem) => void;
  closeItem: () => void;
  addConfiguredItem: (item: MenuItem, cfg: CartConfig) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  /** Validate and open the Square checkout page. Returns an error message, or null on success. */
  checkout: (delivery: { isDelivery: boolean; address: string }) => string | null;
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
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore a previous cart (small persistence upgrade over the demo).
  useEffect(() => {
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

  const configureItem = useCallback((item: MenuItem) => {
    setCartOpen(false);
    setActiveItem(item);
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
    (delivery: { isDelivery: boolean; address: string }) => {
      const { isDelivery, address } = delivery;
      if (!lines.length) return "Please add at least one item.";
      if (isDelivery && subtotal < DELIVERY_MINIMUM)
        return `Delivery orders require a $${DELIVERY_MINIMUM} minimum.`;
      if (isDelivery && !address.trim()) return "Please enter a delivery address.";
      window.open(SQUARE_CHECKOUT_URL, "_blank", "noopener");
      return null;
    },
    [lines.length, subtotal]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count,
      subtotal,
      activeItem,
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

export { DELIVERY_FEE, DELIVERY_MINIMUM, hasSpiceOption, sideOptions };
