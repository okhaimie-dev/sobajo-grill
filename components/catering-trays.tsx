"use client";

import { MenuItem, price, unavailableLabel } from "@/lib/menu";
import { useCart } from "./cart-context";
import { Icon } from "./icons";

/**
 * Size → price for a tray. Variations like "Tilapia — Half Deep" are split
 * into an option ("Tilapia") and a size; option prices are identical today,
 * so the first one wins.
 */
function trayPrices(item: MenuItem) {
  const bySize = new Map<string, number>();
  const options = new Set<string>();
  for (const [name, p] of item.variations) {
    const [option, size] = name.includes(" — ") ? name.split(" — ") : [null, name];
    if (option) options.add(option);
    if (!bySize.has(size)) bySize.set(size, p);
  }
  return { bySize, options: [...options] };
}

/** Pan sizes across all trays, in the order they first appear (Half Shallow, Half Deep, Full Tray…). */
function allSizes(items: MenuItem[]): string[] {
  return [...new Set(items.flatMap((item) => [...trayPrices(item).bySize.keys()]))];
}

/** Pricing matrix for every catering tray × pan size; rows open the item customizer. */
export default function CateringTrays({ items }: { items: MenuItem[] }) {
  const { configureItem } = useCart();
  const sizes = allSizes(items);
  return (
    <div className="price-table-wrap">
      <table className="price-table">
        <caption className="sr-only">Catering tray prices by pan size</caption>
        <thead>
          <tr>
            <th scope="col">Tray</th>
            {sizes.map((s) => (
              <th scope="col" key={s}>
                {s}
              </th>
            ))}
            <th scope="col">
              <span className="sr-only">Order</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const { bySize, options } = trayPrices(item);
            return (
              <tr key={item.name}>
                <th scope="row">
                  <strong>{item.name.replace(/ (Catering )?Tray$/, "")}</strong>
                  <span>{[options.join(" or "), item.name.startsWith("Fire-Grilled Fish") ? "No suya spice" : ""].filter(Boolean).join(" · ")}</span>
                </th>
                {sizes.map((s) => (
                  <td key={s} data-label={s}>
                    {bySize.has(s) ? price(bySize.get(s)!) : <span className="na" aria-label="Not available">—</span>}
                  </td>
                ))}
                <td className="price-action">
                  {unavailableLabel(item) ? (
                    <button className="add-btn" disabled>
                      {unavailableLabel(item)}
                    </button>
                  ) : (
                    <button className="add-btn" onClick={() => configureItem(item)} aria-label={`Add ${item.name}`}>
                      <Icon name="plus" /> Add
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
