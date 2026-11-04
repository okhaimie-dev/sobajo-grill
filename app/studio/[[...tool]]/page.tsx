import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

/** Sanity Studio — the content editor. Staff sign in with their Sanity account. */
export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
