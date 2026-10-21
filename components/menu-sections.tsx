"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/assets";
import {
  MENU_SECTIONS,
  MenuItem,
  MenuSection,
  fromPrice,
  imageSrcSet,
  price,
} from "@/lib/menu";
import { useCart } from "./cart-context";
import { Icon } from "./icons";

/** Responsive image props for a menu item (Unsplash srcset or local /public file). */
export function itemImageProps(item: MenuItem, sizes: string) {
  if (!item.image) return null;
  if (!item.image.startsWith("http")) return { src: asset(item.image) };
  return { src: `${item.image}&w=800`, srcSet: imageSrcSet(item.image), sizes };
}

function DishCard({ item }: { item: MenuItem }) {
  const { configureItem } = useCart();
  const img = itemImageProps(item, "(max-width: 640px) 100vw, (max-width: 900px) 50vw, 380px");
  const multi = item.variations.length > 1;
  return (
    <article className="dish-card">
      <div className="dish-media">
        {img && <img {...img} alt={item.name} loading="lazy" decoding="async" width={800} height={600} />}
        {item.badge && <span className="chip chip-solid">{item.badge}</span>}
      </div>
      <div className="dish-body">
        <h4>{item.name}</h4>
        <p className="dish-desc">{item.description}</p>
        <div className="dish-foot">
          <span className="dish-price">
            {multi && <small>From</small>}
            {price(fromPrice(item))}
          </span>
          <button className="add-btn" onClick={() => configureItem(item)} aria-label={`Add ${item.name}`}>
            <Icon name="plus" /> Add
          </button>
        </div>
      </div>
    </article>
  );
}

function FeatureDish({ item }: { item: MenuItem }) {
  const { configureItem } = useCart();
  const img = itemImageProps(item, "(max-width: 900px) 100vw, 640px");
  return (
    <article className="feature-dish">
      <div className="dish-media">
        {img && <img {...img} alt={`${item.name} on the grill`} loading="lazy" decoding="async" width={1200} height={800} />}
      </div>
      <div className="dish-body">
        {item.badge && <span className="chip">{item.badge}</span>}
        <h4>{item.name}</h4>
        <p className="dish-desc">{item.description}</p>
        <ul className="size-list" aria-label="Sizes">
          {item.variations.map(([name, p]) => (
            <li key={name}>
              {name}
              <strong>{price(p)}</strong>
            </li>
          ))}
        </ul>
        <button className="add-btn" onClick={() => configureItem(item)}>
          <Icon name="plus" /> Add to order
        </button>
      </div>
    </article>
  );
}

function Tiers({ items }: { items: MenuItem[] }) {
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
            <h4>
              <span className="sr-only">Ndokoti </span>
              {level}
            </h4>
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
            <button className="add-btn" onClick={() => configureItem(item)}>
              <Icon name="plus" /> Add {level}
            </button>
          </article>
        );
      })}
    </div>
  );
}

function ListRows({ items }: { items: MenuItem[] }) {
  const { configureItem } = useCart();
  return (
    <ul className="menu-list">
      {items.map((item) => (
        <li className="list-row" key={item.name}>
          <div>
            <h4>{item.name}</h4>
            <p>{item.description}</p>
          </div>
          <span className="list-price">{price(fromPrice(item))}</span>
          <button className="icon-add" onClick={() => configureItem(item)} aria-label={`Add ${item.name}`}>
            <Icon name="plus" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function Block({ section }: { section: MenuSection }) {
  return (
    <div className="menu-block" id={section.id} data-menu-block>
      <div className="menu-block-head">
        <h3>{section.title}</h3>
        {section.layout !== "feature" && <span className="count">{section.items.length} items</span>}
      </div>
      {section.note && <p className="menu-note">{section.note}</p>}
      {section.layout === "feature" && section.items.map((i) => <FeatureDish key={i.name} item={i} />)}
      {section.layout === "cards" && (
        <div className="menu-grid">
          {section.items.map((i) => (
            <DishCard key={i.name} item={i} />
          ))}
        </div>
      )}
      {section.layout === "tiers" && <Tiers items={section.items} />}
      {section.layout === "list" && <ListRows items={section.items} />}
    </div>
  );
}

/** Highlights the tab for the menu block currently in view. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

const IDS = MENU_SECTIONS.map((s) => s.id);

export default function MenuSections() {
  const active = useActiveSection(IDS);
  const tabsRef = useRef<HTMLElement>(null);

  // Keep the active tab visible in the horizontally scrolling bar (mobile).
  useEffect(() => {
    const bar = tabsRef.current;
    const tab = bar?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    if (!bar || !tab) return;
    bar.scrollTo({ left: tab.offsetLeft - bar.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  // Sides + drinks are short lists — show them side by side.
  const lists = MENU_SECTIONS.filter((s) => s.layout === "list");
  const rest = MENU_SECTIONS.filter((s) => s.layout !== "list");

  return (
    <section className="section section-alt" id="menu" aria-labelledby="menu-title">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">Full Menu</div>
            <h2 className="section-title" id="menu-title">
              The Sobajo menu.
            </h2>
          </div>
          <p className="section-lede">
            Tap any dish to choose size, spice level and sides, then pick pickup or delivery at
            checkout.
          </p>
        </div>

        <div className="menu-nav">
          <nav className="menu-tabs" ref={tabsRef} aria-label="Menu categories">
            {MENU_SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="menu-tab"
                data-tab={s.id}
                aria-current={active === s.id ? "true" : undefined}
              >
                {s.tab}
              </a>
            ))}
          </nav>
        </div>

        {rest.map((s) => (
          <Block key={s.id} section={s} />
        ))}
        <div className="menu-pair">
          {lists.map((s) => (
            <Block key={s.id} section={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
