"use client";

import { asset } from "@/lib/assets";
import { MenuItem, fromPrice, imageSrcSet, price, unavailableLabel } from "@/lib/menu";
import { useCart } from "./cart-context";
import { Icon } from "./icons";

/** Responsive image props for a menu item (Sanity/Unsplash srcset or local /public file). */
export function itemImageProps(item: MenuItem, sizes: string) {
  if (!item.image) return null;
  const style = item.imagePosition ? { objectPosition: item.imagePosition } : undefined;
  if (!item.image.startsWith("http")) return { src: asset(item.image), style };
  return { src: `${item.image}&w=800`, srcSet: imageSrcSet(item.image), sizes, style };
}



export function DishCard({ item }: { item: MenuItem }) {
  const { configureItem } = useCart();
  const img = itemImageProps(item, "(max-width: 640px) 112px, (max-width: 900px) 50vw, 380px");
  const multi = item.variations.length > 1;
  const blocked = unavailableLabel(item);
  return (
    <article className={`dish-card${blocked ? " is-unavailable" : ""}`}>
      <div className="dish-media">
        {img && <img {...img} alt={item.name} loading="lazy" decoding="async" width={800} height={600} />}
        {blocked ? (
          <span className="chip chip-solid">{blocked}</span>
        ) : (
          item.badge && <span className="chip chip-solid">{item.badge}</span>
        )}
      </div>
      <div className="dish-body">
        <h3>{item.name}</h3>
        <p className="dish-desc">{item.description}</p>
        <div className="dish-foot">
          <span className="dish-price">
            {multi && <small>From</small>}
            {price(fromPrice(item))}
          </span>
          {blocked ? (
            <button className="add-btn" disabled>
              {blocked}
            </button>
          ) : (
            <button className="add-btn" onClick={() => configureItem(item)} aria-label={`Add ${item.name}`}>
              <Icon name="plus" /> Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function FeatureDish({ item }: { item: MenuItem }) {
  const { configureItem } = useCart();
  const img = itemImageProps(item, "(max-width: 900px) 100vw, 640px");
  const blocked = unavailableLabel(item);
  return (
    <article className="feature-dish">
      <div className="dish-media">
        {img && <img {...img} alt={`${item.name} on the grill`} loading="lazy" decoding="async" width={1200} height={800} />}
      </div>
      <div className="dish-body">
        {blocked ? <span className="chip">{blocked}</span> : item.badge && <span className="chip">{item.badge}</span>}
        <h3>{item.name}</h3>
        <p className="dish-desc">{item.description}</p>
        <ul className="size-list" aria-label="Choose a size">
          {item.variations.map(([name, p], idx) => (
            <li key={name}>
              <button type="button" disabled={Boolean(blocked)} onClick={() => configureItem(item, idx)} aria-label={`Add ${item.name}, ${name}, ${price(p)}`}>
                {name}
                <strong>{price(p)}</strong>
              </button>
            </li>
          ))}
        </ul>
        <button className="add-btn" disabled={Boolean(blocked)} onClick={() => configureItem(item)}>
          {blocked ?? (
            <>
              <Icon name="plus" /> Add to order
            </>
          )}
        </button>
      </div>
    </article>
  );
}

export function Tiers({ items }: { items: MenuItem[] }) {
  const { configureItem } = useCart();
  return (
    <div className="tier-grid">
      {items.map((item, idx) => {
        const [serves, p] = item.variations[0];
        const level = item.name.replace("Ndokoti ", "");
        const prev = idx > 0 ? items[idx - 1].name.replace("Ndokoti ", "") : null;
        return (
          <article className="tier" key={item.name}>
            <div className="tier-flames" aria-hidden="true">
              {Array.from({ length: idx + 1 }, (_, i) => (
                <Icon key={i} name="flame" />
              ))}
            </div>
            <h3>
              <span className="sr-only">Ndokoti </span>
              {level}
            </h3>
            <p className="tier-serves">{serves}</p>
            <div className="tier-price">{price(p)}</div>
            <ul>
              {prev && <li className="tier-prev">Everything in {prev}, plus</li>}
              {(item.includes ?? [item.description]).map((inc) => (
                <li key={inc}>
                  <Icon name="check" /> {inc}
                </li>
              ))}
            </ul>
            <button className="add-btn" disabled={Boolean(unavailableLabel(item))} onClick={() => configureItem(item)}>
              {unavailableLabel(item) ?? (
                <>
                  <Icon name="plus" /> Add {level}
                </>
              )}
            </button>
          </article>
        );
      })}
    </div>
  );
}

export function ListRows({ items }: { items: MenuItem[] }) {
  const { configureItem } = useCart();
  return (
    <ul className="menu-list">
      {items.map((item) => (
        <li className="list-row" key={item.name}>
          <div>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
          </div>
          <span className="list-price">{unavailableLabel(item) ?? price(fromPrice(item))}</span>
          <button
            className="icon-add"
            disabled={Boolean(unavailableLabel(item))}
            onClick={() => configureItem(item)}
            aria-label={unavailableLabel(item) ? `${item.name}: ${unavailableLabel(item)!.toLowerCase()}` : `Add ${item.name}`}
          >
            <Icon name="plus" />
          </button>
        </li>
      ))}
    </ul>
  );
}
