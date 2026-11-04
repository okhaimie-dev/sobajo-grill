"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { MenuSection } from "@/lib/menu";
import { Icon } from "./icons";
import { DishCard, FeatureDish, ListRows, Tiers } from "./menu-items";

function Block({ section }: { section: MenuSection }) {
  return (
    <section className="menu-block" id={section.id} aria-labelledby={`${section.id}-title`}>
      <div className="menu-block-head">
        <h2 id={`${section.id}-title`}>{section.title}</h2>
        {section.layout !== "feature" && <span className="count">{section.items.length} items</span>}
      </div>
      {section.note && <p className="menu-note">{section.note}</p>}
      {section.id === "catering-menu" && (
        <p className="menu-note">
          <Link className="text-link" href="/catering/">
            Planning an event? See catering pricing &amp; how it works <Icon name="arrow" />
          </Link>
        </p>
      )}
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
    </section>
  );
}

/** Highlights the tab for the menu block currently in view. */
function useActiveSection(idList: string) {
  const [active, setActive] = useState(idList.split(" ")[0]);
  useEffect(() => {
    const els = idList.split(" ").map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [idList]);
  return active;
}

/** The full menu body for /menu/: sticky category bar + every section. */
export default function MenuSections({ sections: all }: { sections: MenuSection[] }) {
  const sections = all.filter((s) => s.items.length);
  // Space-joined so the observer effect only re-runs when the section list changes.
  const ids = sections.map((s) => s.id).join(" ");
  const active = useActiveSection(ids);
  const tabsRef = useRef<HTMLElement>(null);

  // Keep the active tab visible in the horizontally scrolling bar (mobile).
  useEffect(() => {
    const bar = tabsRef.current;
    const tab = bar?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    if (!bar || !tab) return;
    bar.scrollTo({ left: tab.offsetLeft - bar.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  // Sides + drinks are short lists — show them side by side.
  const lists = sections.filter((s) => s.layout === "list");
  const rest = sections.filter((s) => s.layout !== "list");

  return (
    <div className="section section-alt menu-page">
      <div className="container">
        <div className="menu-nav">
          <nav className="menu-tabs" ref={tabsRef} aria-label="Menu categories">
            {sections.map((s) => (
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
    </div>
  );
}
