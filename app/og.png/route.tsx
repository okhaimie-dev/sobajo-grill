import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

// Social share card (links, ads, group chats), rendered once at build time.
// A route named og.png — rather than the opengraph-image convention — so the
// exported file keeps a .png extension and static hosts send image/png.
export const dynamic = "force-static";

export const OG_SIZE = { width: 1200, height: 630 };

async function dataUri(file: string, mime: string): Promise<string> {
  const buf = await readFile(join(process.cwd(), "public", file));
  return `data:${mime};base64,${buf.toString("base64")}`;
}

/** Brand display font as TTF (Satori can't read woff2). */
async function displayFont(weight: number): Promise<ArrayBuffer> {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@${weight}`)
  ).text();
  const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
  if (!url) throw new Error("OG image: could not resolve Bricolage Grotesque TTF");
  return (await fetch(url)).arrayBuffer();
}

export async function GET() {
  const [hero, logo, bold, semi] = await Promise.all([
    dataUri("hero.jpg", "image/jpeg"),
    dataUri("logo.png", "image/png"),
    displayFont(800),
    displayFont(600),
  ]);
  const fill = { position: "absolute", top: 0, left: 0, width: OG_SIZE.width, height: OG_SIZE.height } as const;

  return new ImageResponse(
    (
      <div style={{ ...fill, display: "flex", background: "#0a0706", fontFamily: "Bricolage" }}>
        <img src={hero} width={OG_SIZE.width} height={OG_SIZE.height} style={{ ...fill, objectFit: "cover", objectPosition: "70% 50%" }} alt="" />
        <div
          style={{
            ...fill,
            backgroundImage:
              "linear-gradient(90deg, rgba(10,7,6,0.97) 0%, rgba(10,7,6,0.88) 45%, rgba(10,7,6,0.2) 100%)",
          }}
        />
        <div style={{ ...fill, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px" }}>
          <img src={logo} width={176} height={119} alt="" />
          <div style={{ marginTop: 30, color: "#f6d83d", fontSize: 24, fontWeight: 600, letterSpacing: 5, textTransform: "uppercase" }}>
            Baltimore Suya &amp; African Grill
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 12, color: "#fff", fontSize: 104, fontWeight: 800, lineHeight: 0.95, letterSpacing: -4 }}>
            <span>Fire. Flavor.</span>
            <span style={{ color: "#ff2d46" }}>Friendship.</span>
          </div>
          <div style={{ marginTop: 30, color: "#e9e1dc", fontSize: 28, fontWeight: 600 }}>
            {`Pickup · Delivery · Catering — ${SITE.address.street}, ${SITE.address.city}`}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Bricolage", data: bold, weight: 800, style: "normal" },
        { name: "Bricolage", data: semi, weight: 600, style: "normal" },
      ],
    }
  );
}
