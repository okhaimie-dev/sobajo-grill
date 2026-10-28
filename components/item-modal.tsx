"use client";

import { useEffect, useState } from "react";
import {
  MenuItem,
  money,
  price,
  sideOptions,
} from "@/lib/menu";
import { useCart } from "./cart-context";
import { Icon } from "./icons";
import { itemImageProps } from "./menu-items";
import { useDialog } from "./use-dialog";

export default function ItemModal() {
  const { activeItem, activeVariation, closeItem, addConfiguredItem } = useCart();
  const [variationIdx, setVariationIdx] = useState(0);
  const [sideIdx, setSideIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const item: MenuItem | null = activeItem;
  const ref = useDialog(item !== null, closeItem);

  // Reset the form whenever a new item is being configured.
  useEffect(() => {
    if (!item) return;
    setVariationIdx(activeVariation);
    setSideIdx(0);
    setQuantity(1);
    setNotes("");
  }, [item, activeVariation]);

  const sides = item ? sideOptions(item) : [];
  const variation = item?.variations[variationIdx];
  const side = sides[sideIdx];
  const unit = (variation?.[1] ?? 0) + (side?.[1] ?? 0);
  const img = item ? itemImageProps(item, "(max-width: 640px) 100vw, 640px") : null;

  const add = () => {
    if (!item || !variation) return;
    addConfiguredItem(item, {
      variation: variation[0],
      unitBasePrice: unit,
      quantity: Math.max(1, quantity),
      side: side ? side[0] : "",
      sidePrice: side?.[1] ?? 0,
      notes,
    });
  };

  return (
    <dialog ref={ref} className="modal dialog" aria-labelledby="item-title">
      {item && variation && (
        <>
          <div className="modal-scroll">
            {img ? (
              <div className="modal-media">
                <img {...img} alt="" />
                <button className="icon-btn" onClick={closeItem} aria-label="Close">
                  <Icon name="close" />
                </button>
              </div>
            ) : null}
            <div className="modal-head">
              <div>
                <div className="eyebrow">Customize</div>
                <h2 id="item-title">{item.name}</h2>
              </div>
              {!img && (
                <button className="icon-btn" onClick={closeItem} aria-label="Close">
                  <Icon name="close" />
                </button>
              )}
            </div>
            <div className="modal-body">
              <p className="muted">{item.description}</p>

              {item.variations.length > 1 && (
                <fieldset className="choices">
                  <legend>Size</legend>
                  <div className="choice-row">
                    {item.variations.map(([name, p], idx) => (
                      <label className="choice" key={name}>
                        <input
                          type="radio"
                          name="variation"
                          checked={variationIdx === idx}
                          onChange={() => setVariationIdx(idx)}
                        />
                        <span>
                          {name} <em>{price(p)}</em>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {sides.length > 0 && (
                <fieldset className="choices">
                  <legend>{item.sideMode === "included" ? "Included side" : "Add a side"}</legend>
                  <div className="choice-row">
                    {sides.map(([name, extra], idx) => (
                      <label className="choice" key={name}>
                        <input type="radio" name="side" checked={sideIdx === idx} onChange={() => setSideIdx(idx)} />
                        <span>
                          {name} {extra ? <em>+{price(extra)}</em> : null}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              <label className="field">
                <span className="field-label">Special instructions</span>
                <textarea
                  className="input"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. extra onions, sauce on the side"
                />
              </label>
            </div>
          </div>
          <div className="modal-foot">
            <div className="stepper" role="group" aria-label="Quantity">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1} aria-label="Decrease quantity">
                <Icon name="minus" />
              </button>
              <output aria-live="polite">{quantity}</output>
              <button onClick={() => setQuantity((q) => Math.min(99, q + 1))} aria-label="Increase quantity">
                <Icon name="plus" />
              </button>
            </div>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={add}>
              Add to order · {money(unit * quantity)}
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}
