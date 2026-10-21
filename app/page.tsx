import { FAQS } from "@/lib/faq";
import { SITE } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/structured-data";
import Hero from "@/components/hero";
import Marquee from "@/components/marquee";
import Experiences from "@/components/experiences";
import MenuHighlights from "@/components/menu-highlights";
import Catering from "@/components/catering";
import Delivery from "@/components/delivery";
import Story from "@/components/story";
import Reviews from "@/components/reviews";
import Shipping from "@/components/shipping";
import Faq from "@/components/faq";
import Cta from "@/components/cta";
import JsonLd from "@/components/json-ld";

export const metadata = pageMetadata({ description: SITE.description, path: "/" });

export default function Home() {
  return (
    <>
      <JsonLd data={faqJsonLd(FAQS, "/")} />
      <Hero />
      <Marquee />
      <Experiences />
      <MenuHighlights />
      <Catering />
      <Delivery />
      <Story />
      <Reviews />
      <Shipping />
      <Faq />
      <Cta />
    </>
  );
}
