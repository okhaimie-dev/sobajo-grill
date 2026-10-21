"use client";

import { useState } from "react";
import { CartLine, money } from "@/lib/menu";
import { DELIVERY_FEE, DELIVERY_MINIMUM, useCart } from "./cart-context";
import { Icon } from "./icons";
import { useDialog } from "./use-dialog";

function CartItemRow({ line }: { line: CartLine }) {
  const { removeItem } = useCart();
  const details = [
    line.variation + (line.quantity > 1 ? ` × ${line.quantity}` : ""),
    line.spice,
    line.side,
    line.notes,
  ].filter(Boolean);
  return (
    <li className="cart-line">
      <strong>{line.name}</strong>
      <span className="line-price">{money(line.price)}</span>
      <span className="meta">{details.join(" · ")}</span>
      <button className="link-btn" onClick={() => removeItem(line.id)} aria-label={`Remove ${line.name}`}>
        Remove
      </button>
    </li>
  );
}

export default function CartModal() {
  const { lines, subtotal, cartOpen, closeCart, clearCart, checkout } = useCart();

  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [orderTime, setOrderTime] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const ref = useDialog(cartOpen, closeCart);

  const isDelivery = orderType === "delivery";
  const fee = isDelivery ? DELIVERY_FEE : 0;
  const shortBy = Math.max(0, DELIVERY_MINIMUM - subtotal);
  const empty = lines.length === 0;

  return (
    <dialog ref={ref} className="modal sheet" aria-labelledby="cart-title">
      <div className="modal-head" style={{ paddingBottom: 18, borderBottom: "1px solid var(--line)" }}>
        <div>
          <div className="eyebrow">Your order</div>
          <h2 id="cart-title">
            Cart{" "}
            {!empty && <span style={{ color: "var(--muted)", fontWeight: 600 }}>({lines.length})</span>}
          </h2>
        </div>
        <button className="icon-btn" onClick={closeCart} aria-label="Close cart">
          <Icon name="close" />
        </button>
      </div>

      <div className="modal-scroll">
        <div className="modal-body" style={{ paddingTop: 4 }}>
          {empty ? (
            <div className="empty-state">
              <Icon name="bag" />
              <strong>Your cart is empty</strong>
              Add a dish from the menu to get started.
              <div>
                <a className="btn btn-primary" href="#menu" onClick={closeCart}>
                  Browse the menu
                </a>
              </div>
            </div>
          ) : (
            <>
              <ul className="cart-lines">
                {lines.map((l) => (
                  <CartItemRow key={l.id} line={l} />
                ))}
              </ul>

              <fieldset className="choices">
                <legend>How would you like it?</legend>
                <div className="segmented">
                  {(["pickup", "delivery"] as const).map((t) => (
                    <label key={t}>
                      <input
                        type="radio"
                        name="orderType"
                        value={t}
                        checked={orderType === t}
                        onChange={() => {
                          setOrderType(t);
                          setError(null);
                        }}
                      />
                      <span>
                        <Icon name={t === "pickup" ? "store" : "truck"} />
                        {t === "pickup" ? "Pickup" : "Delivery"}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {isDelivery && shortBy > 0 && (
                <div className="notice" role="status">
                  Add <strong>{money(shortBy)}</strong> more to unlock delivery (${DELIVERY_MINIMUM} minimum).
                  <div className="progress" aria-hidden="true">
                    <span style={{ width: `${Math.min(100, (subtotal / DELIVERY_MINIMUM) * 100)}%` }} />
                  </div>
                </div>
              )}

              {isDelivery && (
                <label className="field">
                  <span className="field-label">Delivery address</span>
                  <input
                    className="input"
                    autoComplete="street-address"
                    placeholder="Street, city, ZIP"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setError(null);
                    }}
                  />
                </label>
              )}

              <label className="field">
                <span className="field-label">Preferred {isDelivery ? "delivery" : "pickup"} time</span>
                <input
                  className="input"
                  type="datetime-local"
                  value={orderTime}
                  onChange={(e) => setOrderTime(e.target.value)}
                />
              </label>

              <div className="summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery fee</span>
                  <span>{isDelivery ? money(fee) : "—"}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{money(subtotal + fee)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {!empty && (
        <div className="modal-foot" style={{ flexDirection: "column", alignItems: "stretch" }}>
          {error && (
            <div className="notice error" role="alert">
              {error}
            </div>
          )}
          <button className="btn btn-primary btn-block" onClick={() => setError(checkout({ isDelivery, address }))}>
            Continue to secure checkout · {money(subtotal + fee)}
          </button>
          <button className="link-btn muted-link" style={{ justifySelf: "center", alignSelf: "center" }} onClick={clearCart}>
            Clear cart
          </button>
        </div>
      )}
    </dialog>
  );
}
