"use client";

import { MENU_SECTIONS, money, MenuItem } from "@/lib/menu";
import { useCart } from "./cart-context";

function MenuItemCard({ item }: { item: MenuItem }) {
  const { configureItem } = useCart();
  return (
    <article className="card">
      <div className="card-img" style={{ backgroundImage: `url('${item.image}')` }} />
      <div className="card-body">
        <h4>{item.name}</h4>
        <p>{item.description}</p>
        <div className="card-row">
          <span className="price">{"From $" + item.variations[0][1]}</span>
          <button className="btn red" onClick={() => configureItem(item)}>
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

export default function MenuSections() {
  return (
    <section id="menu">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">Full Menu</div>
            <h2>Choose your Sobajo experience.</h2>
          </div>
          <p>
            Add items directly to your cart, customize size and spice level, then
            choose pickup or delivery.
          </p>
        </div>

        <div className="menu-tabs">
          {MENU_SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.title === "Catering Trays" ? "Catering" : s.title}
            </a>
          ))}
        </div>

        {MENU_SECTIONS.map((s) => (
          <div className="menu-section" id={s.id} key={s.id}>
            <h3>{s.title}</h3>
            {s.note && <p className="menu-note">{s.note}</p>}
            <div className="grid">
              {s.items.map((item) => (
                <MenuItemCard key={item.name} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
