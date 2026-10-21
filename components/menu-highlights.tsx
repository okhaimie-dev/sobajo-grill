import Link from "next/link";
import { MENU_SECTIONS } from "@/lib/menu";
import { Icon } from "./icons";
import { DishCard, FeatureDish } from "./menu-items";

const signature = MENU_SECTIONS.find((s) => s.id === "bowls")!.items[0];
const grill = MENU_SECTIONS.find((s) => s.id === "grill")!.items;

/** Home-page teaser: the signature dish + fire-grilled collection, linking to /menu/. */
export default function MenuHighlights() {
  return (
    <section className="section section-alt" id="menu" aria-labelledby="menu-title">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">Signature dishes</div>
            <h2 className="section-title" id="menu-title">
              Straight off the fire.
            </h2>
          </div>
          <p className="section-lede">
            Start with the dishes Sobajo is known for — or explore the full menu of Ndokoti
            platters, catering trays, sides and drinks.
          </p>
        </div>
        <FeatureDish item={signature} />
        <div className="menu-grid" style={{ marginTop: 18 }}>
          {grill.map((i) => (
            <DishCard key={i.name} item={i} />
          ))}
        </div>
        <div className="section-cta">
          <Link className="btn btn-primary" href="/menu/">
            Explore the full menu <Icon name="arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}
