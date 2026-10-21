/** Inline stroke icons (24×24, currentColor) — no icon-font or package needed. */

import type { SVGProps } from "react";

const PATHS = {
  flame: "M12 3c.5 3.5 4.5 5.5 4.5 10a4.5 4.5 0 1 1-9 0c0-2 1-3.2 2-4 .2 1.6 1 2.5 2 3 0-3.5-.5-6 .5-9Z",
  bag: "M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  check: "m5 12.5 4.5 4.5L19 7.5",
  pin: "M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  phone: "M5 4h3.5l1.5 4.5-2.2 1.3a11 11 0 0 0 6.4 6.4l1.3-2.2L20 15.5V19a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z",
  mail: "M4 6h16v12H4V6Zm0 0 8 7 8-7",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4.5l3 2",
  truck: "M3 6h11v10H3V6Zm11 4h4l3 3v3h-7v-6ZM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  route: "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12-10a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM6 15V9a3 3 0 0 1 3-3h3m0 12h3a3 3 0 0 0 3-3V9",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9a6 6 0 0 1 12 0m1-9a3 3 0 1 0 0-6m2 15a5 5 0 0 0-3-4.6",
  driver: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-9-3h6m6 0h6m-9 3v6",
  store: "M4 10v10h16V10M3 6l2-3h14l2 3v1.5a2.5 2.5 0 0 1-4.5 1.5 2.5 2.5 0 0 1-4.5 0 2.5 2.5 0 0 1-4.5 0A2.5 2.5 0 0 1 3 7.5V6Zm7 14v-5h4v5",
  package: "M12 3 4 7v10l8 4 8-4V7l-8-4Zm0 8L4 7m8 4 8-4m-8 4v10",
  gift: "M4 11h16v9H4v-9Zm-1-4h18v4H3V7Zm9 0v13M12 7S10.5 3 8 3.5 7 7 12 7Zm0 0s1.5-4 4-3.5S17 7 12 7Z",
  pepper: "M14 6c-1-2 0-3 1.5-3M9 8c3-3 8-2 9 1 1.5 4.5-4 11-11 12-3 .4-4-2-2-3 4-2 1-7 4-10Z",
  bottle: "M10 3h4v4l2 3v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10l2-3V3Zm-2 9h8",
  heart: "M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.4-7.5 10-7.5 10Z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3Z",
  calendar: "M4 6h16v14H4V6Zm0 4h16M8 3v5m8-5v5",
} as const;

export type IconName = keyof typeof PATHS | "star" | "instagram" | "tiktok";

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  const common = { viewBox: "0 0 24 24", "aria-hidden": true, focusable: false, ...props } as const;
  if (name === "star") {
    return (
      <svg {...common} fill="currentColor">
        <path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8L12 3Z" />
      </svg>
    );
  }
  if (name === "instagram") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === "tiktok") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M16.6 3c.4 2.2 1.8 3.7 4 4v3.1a7.3 7.3 0 0 1-4-1.3v6.4A6 6 0 1 1 10.7 9v3.2a2.9 2.9 0 1 0 2.8 2.9V3h3.1Z" />
      </svg>
    );
  }
  return (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name]} />
    </svg>
  );
}

export function Stars({ count = 5, label = "5 out of 5 stars" }: { count?: number; label?: string }) {
  return (
    <span className="stars" role="img" aria-label={label}>
      {Array.from({ length: count }, (_, i) => (
        <Icon key={i} name="star" />
      ))}
    </span>
  );
}
