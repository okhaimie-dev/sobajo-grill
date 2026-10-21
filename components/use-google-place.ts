"use client";

import { RefObject, useEffect, useState } from "react";
import { BASE_PATH } from "@/lib/assets";
import type { GooglePlace } from "@/lib/google-place";

export type PlaceState =
  | { status: "idle" | "loading" }
  | { status: "ready"; place: GooglePlace }
  | { status: "unavailable" };

// One request per page view, shared by every section that shows Google data.
let request: Promise<GooglePlace | null> | null = null;

function load(): Promise<GooglePlace | null> {
  request ??= fetch(`${BASE_PATH}/api/google-place/`)
    .then((r) => (r.ok ? (r.json() as Promise<GooglePlace | { configured: false }>) : null))
    .then((data) => (data && "reviews" in data ? data : null))
    .catch(() => null);
  return request;
}

/**
 * Live Google rating/reviews/hours, fetched only once `ref` is near the
 * viewport — each call is billable, and most visitors never scroll that far.
 */
export function useGooglePlace(ref: RefObject<Element | null>): PlaceState {
  const [state, setState] = useState<PlaceState>({ status: "idle" });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setState({ status: "loading" });
        load().then((place) => {
          if (!cancelled) setState(place ? { status: "ready", place } : { status: "unavailable" });
        });
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [ref]);

  return state;
}
