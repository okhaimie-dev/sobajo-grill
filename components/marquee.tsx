import { Icon } from "./icons";

const WORDS = [
  "Beef Brisket Suya",
  "Obasanjo Fire Chicken",
  "Smoky Jollof",
  "Fried Plantains",
  "Fire Wings",
  "Smoked Turkey Wings",
  "Zobo",
  "Ndokoti Platters",
];

/** Decorative ticker; the track is duplicated so the loop is seamless. */
export default function Marquee() {
  const run = WORDS.map((w) => (
    <span key={w}>
      {w} <Icon name="flame" />
    </span>
  ));
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {run}
        {run}
      </div>
    </div>
  );
}
