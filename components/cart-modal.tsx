"use client";

import { useState } from "react";
import { CartLine, money } from "@/lib/menu";
import { DELIVERY_FEE, useCart } from "./cart-context";
import { useBackdropClose } from "./item-modal";

function CartItemRow({ line }: { line: CartLine }) {
  const { removeItem } = useCart();
  return (
    <div className="cart-item">
      <div>
        <strong>{line.name}</strong>
        <div className="muted">
          {line.variation}
          {line.quantity > 1 ? " × " + line.quantity : ""}
          {line.spice ? " • " + line.spice : ""}
          {line.side ? " • " + line.side : ""}
          {line.notes ? " • " + line.notes : ""}
        </div>
      </div>
      <div>
        <strong>{money(line.price)}</strong>
        <br />
        <button
          className="close"
          style={{ fontSize: "1rem", color: "#ff667b" }}
          onClick={() => removeItem(line.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default function CartModal() {
  const { lines, subtotal, cartOpen, closeCart, clearCart, checkout } = useCart();

  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [orderTime, setOrderTime] = useState("");
  const [address, setAddress] = useState("");

  const isDelivery = orderType === "delivery";
  const fee = isDelivery ? DELIVERY_FEE : 0;
  const underMinimum = isDelivery && subtotal < 100;

  useBackdropClose(closeCart, cartOpen);

  if (!cartOpen) return <div className="modal" id="cartModal" />;

  return (
    <div
      className="modal open"
      id="cartModal"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCart();
      }}
    >
      <div className="modal-card">
        <div className="modal-head">
          <div>
            <div className="eyebrow">Your Order</div>
            <h3>Shopping Cart</h3>
          </div>
          <button className="close" onClick={closeCart} aria-label="Close">
            ×
          </button>
        </div>

        <div id="cartItems">
          {lines.length === 0 ? (
            <p className="muted">Your cart is empty.</p>
          ) : (
            lines.map((l) => <CartItemRow key={l.id} line={l} />)
          )}
        </div>

        <div className="summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{money(subtotal)}</strong>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <strong>{money(fee)}</strong>
          </div>
          <div className="summary-row">
            <span>Total</span>
            <strong>{money(subtotal + fee)}</strong>
          </div>
        </div>

        <div className="checkout-grid">
          <label>
            Order Type
            <select
              id="orderType"
              value={orderType}
              onChange={(e) => setOrderType(e.target.value as "pickup" | "delivery")}
            >
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
            </select>
          </label>
          <label>
            Preferred Time
            <input
              type="datetime-local"
              id="orderTime"
              value={orderTime}
              onChange={(e) => setOrderTime(e.target.value)}
            />
          </label>
        </div>

        {isDelivery && (
          <div id="addressWrap" style={{ marginTop: 14 }}>
            <label>
              Delivery Address
              <input
                id="deliveryAddress"
                placeholder="Street, city, ZIP"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
          </div>
        )}

        {underMinimum && (
          <div className="notice" id="deliveryNotice">
            Delivery requires a minimum order of $100.
          </div>
        )}

        <div className="actions">
          <button
            className="btn red"
            onClick={() => checkout({ isDelivery, address })}
          >
            Continue to Square Checkout
          </button>
          <button className="btn dark" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
