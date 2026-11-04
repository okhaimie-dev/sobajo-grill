"use client";

import Link from "next/link";
import { useState } from "react";
import { shortDay, todayInBaltimore } from "@/lib/campaigns";
import { CartLine, allowedPickupDays, money } from "@/lib/menu";
import { useCart } from "./cart-context";
import { Icon } from "./icons";
import { useDialog } from "./use-dialog";

function CartItemRow({ line }: { line: CartLine }) {
  const { removeItem, setQuantity } = useCart();
  const details = [line.variation, line.side, line.notes].filter(Boolean);
  return (
    <li className="cart-line">
      <strong>{line.name}</strong>
      <span className="line-price">{money(line.price)}</span>
      <span className="meta">{details.join(" · ")}</span>
      <div className="stepper stepper-sm" role="group" aria-label={`Quantity of ${line.name}`}>
        <button
          type="button"
          onClick={() => setQuantity(line.id, line.quantity - 1)}
          disabled={line.quantity <= 1}
          aria-label="One fewer"
        >
          <Icon name="minus" />
        </button>
        <output aria-live="polite">{line.quantity}</output>
        <button type="button" onClick={() => setQuantity(line.id, line.quantity + 1)} disabled={line.quantity >= 99} aria-label="One more">
          <Icon name="plus" />
        </button>
      </div>
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
  // Campaign items (e.g. the Thanksgiving turkey): a required pickup day + optional time.
  const [pickupDay, setPickupDay] = useState("");
  const [pickupClock, setPickupClock] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async () => {
    if (pickupDays) {
      if (!pickupDays.length) return setError("The pickup days for an item in your cart have passed — please remove it.");
      if (!pickupDays.includes(pickupDay)) return setError("Please choose a pickup day.");
    }
    setPending(true);
    setError(null);
    const time = pickupDays ? pickupDay + (pickupClock ? `T${pickupClock}` : "") : orderTime;
    const err = await checkout({ isDelivery, address, time });
    setError(err);
    // On success the page is navigating to Square; keep the button disabled.
    if (err) setPending(false);
  };

  const ref = useDialog(cartOpen, closeCart);

  // Any pickup-only item (e.g. the Thanksgiving turkey) makes the whole order pickup.
  const pickupOnly = lines.filter((l) => l.pickupOnly).map((l) => l.name);
  const isDelivery = pickupOnly.length === 0 && orderType === "delivery";
  const pickupDays = allowedPickupDays(
    lines.map((l) => l.pickupDates),
    todayInBaltimore()
  );
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
                <Link className="btn btn-primary" href="/menu/" onClick={closeCart}>
                  Browse the menu
                </Link>
              </div>
            </div>
          ) : (
            <>
              <ul className="cart-lines">
                {lines.map((l) => (
                  <CartItemRow key={l.id} line={l} />
                ))}
              </ul>

              {pickupOnly.length > 0 ? (
                <div className="notice" role="status">
                  <Icon name="store" /> Pickup only — {[...new Set(pickupOnly)].join(", ")}{" "}
                  {new Set(pickupOnly).size > 1 ? "aren't" : "isn't"} available for delivery.
                </div>
              ) : (
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
              )}

              {isDelivery && (
                <div className="notice" role="status">
                  Delivered by DoorDash — no order minimum. DoorDash&apos;s delivery fee is shown at checkout.
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

              {pickupDays ? (
                pickupDays.length ? (
                  <>
                    <fieldset className="choices">
                      <legend>Pickup day *</legend>
                      <div className="segmented">
                        {pickupDays.map((d) => (
                          <label key={d}>
                            <input
                              type="radio"
                              name="pickupDay"
                              value={d}
                              checked={pickupDay === d}
                              onChange={() => {
                                setPickupDay(d);
                                setError(null);
                              }}
                            />
                            <span>
                              <Icon name="calendar" />
                              {shortDay(d)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <label className="field">
                      <span className="field-label">Preferred pickup time (optional)</span>
                      <input className="input" type="time" value={pickupClock} onChange={(e) => setPickupClock(e.target.value)} />
                    </label>
                  </>
                ) : (
                  <div className="notice error" role="alert">
                    The pickup days for an item in your cart have passed — please remove it to check out.
                  </div>
                )
              ) : (
                <label className="field">
                  <span className="field-label">Preferred {isDelivery ? "delivery" : "pickup"} time</span>
                  <input
                    className="input"
                    type="datetime-local"
                    value={orderTime}
                    onChange={(e) => setOrderTime(e.target.value)}
                  />
                </label>
              )}

              <div className="summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>
                {isDelivery && (
                  <div className="summary-row">
                    <span>Delivery fee</span>
                    <span>Set by DoorDash</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>{isDelivery ? "Total before delivery" : "Total"}</span>
                  <span>{money(subtotal)}</span>
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
          <button className="btn btn-primary btn-block" onClick={submit} disabled={pending}>
            {pending ? "Starting secure checkout…" : `Continue to secure checkout · ${money(subtotal)}`}
          </button>
          <button className="link-btn muted-link" style={{ justifySelf: "center", alignSelf: "center" }} onClick={clearCart}>
            Clear cart
          </button>
        </div>
      )}
    </dialog>
  );
}
