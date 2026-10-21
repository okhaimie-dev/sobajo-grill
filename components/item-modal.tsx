"use client";

import { useEffect, useState } from "react";
import {
  MenuItem,
  SPICE_OPTIONS,
  hasSpiceOption,
  sideOptions,
} from "@/lib/menu";
import { useCart } from "./cart-context";

/** Backdrop click + Escape close the modal. */
function useBackdropClose(onClose: () => void, open: boolean) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
}

export default function ItemModal() {
  const { activeItem, closeItem, addConfiguredItem } = useCart();
  const [variationIdx, setVariationIdx] = useState(0);
  const [spice, setSpice] = useState<(typeof SPICE_OPTIONS)[number]>("Medium");
  const [sideValue, setSideValue] = useState("No Side|0");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const item: MenuItem | null = activeItem;
  const open = item !== null;

  useBackdropClose(closeItem, open);

  // Reset the form whenever a new item is being configured.
  useEffect(() => {
    if (!item) return;
    setVariationIdx(0);
    setSpice("Medium");
    const sides = sideOptions(item);
    setSideValue(sides.length ? `${sides[0][0]}|${sides[0][1]}` : "No Side|0");
    setQuantity(1);
    setNotes("");
  }, [item]);

  if (!open || !item) return <div className="modal" id="itemModal" />;

  const spices = hasSpiceOption(item);
  const sides = sideOptions(item);

  const add = () => {
    const [sideName, sideExtra] = sideValue.split("|");
    const variation = item.variations[variationIdx];
    addConfiguredItem(item, {
      variation: variation[0],
      unitBasePrice: variation[1] + Number(sideExtra),
      quantity: Math.max(1, Number(quantity) || 1),
      spice: spices ? spice : "",
      side: sides.length ? sideName : "",
      sidePrice: Number(sideExtra),
      notes,
    });
  };

  return (
    <div
      className="modal open"
      id="itemModal"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeItem();
      }}
    >
      <div className="modal-card">
        <div className="modal-head">
          <div>
            <div className="eyebrow">Customize Item</div>
            <h3>{item.name}</h3>
          </div>
          <button className="close" onClick={closeItem} aria-label="Close">
            ×
          </button>
        </div>
        <p className="muted">{item.description}</p>
        <div className="option-grid">
          <label>
            Variation
            <select
              id="variationSelect"
              value={variationIdx}
              onChange={(e) => setVariationIdx(Number(e.target.value))}
            >
              {item.variations.map((v, idx) => (
                <option key={v[0]} value={idx}>
                  {v[0]} — {`$${v[1]}`}
                </option>
              ))}
            </select>
          </label>
          {spices && (
            <label>
              Spice Level
              <select
                id="spiceSelect"
                value={spice}
                onChange={(e) => setSpice(e.target.value as (typeof SPICE_OPTIONS)[number])}
              >
                {SPICE_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          )}
          {sides.length > 0 && (
            <label>
              Side
              <select
                id="sideSelect"
                value={sideValue}
                onChange={(e) => setSideValue(e.target.value)}
              >
                {sides.map(([name, extra]) => (
                  <option key={name} value={`${name}|${extra}`}>
                    {name}
                    {extra ? ` — +$${extra}` : ""}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            Quantity
            <input
              type="number"
              id="quantityInput"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </label>
        </div>
        <label>
          Special Instructions
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Example: extra onions, sauce on the side"
          />
        </label>
        <div className="actions">
          <button className="btn red" onClick={add}>
            Add to Cart
          </button>
          <button className="btn dark" onClick={closeItem}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export { useBackdropClose };
