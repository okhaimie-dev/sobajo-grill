import { getFaqs, getSite } from "@/lib/content";
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
import Visit from "@/components/visit";
import Shipping from "@/components/shipping";
import Faq from "@/components/faq";
import Cta from "@/components/cta";
import JsonLd from "@/components/json-ld";

export async function generateMetadata() {
  const site = await getSite();
  return pageMetadata({ description: site.description, path: "/", site });
}

export default async function Home() {
  const faqs = (await getFaqs()).home;
  return (
    <>
      <JsonLd data={faqJsonLd(faqs, "/")} />
      <Hero />
      <Marquee />
      <Experiences />
      <MenuHighlights />
      <Catering />
      <Delivery />
      <Story />
      <Reviews />
      <Visit />
      <Shipping />
      <Faq faqs={faqs} />
      <Cta />
    </>
  );
}
