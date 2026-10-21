import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Marquee from "@/components/marquee";
import Experiences from "@/components/experiences";
import MenuSections from "@/components/menu-sections";
import Catering from "@/components/catering";
import Delivery from "@/components/delivery";
import Story from "@/components/story";
import Reviews from "@/components/reviews";
import Shipping from "@/components/shipping";
import Faq from "@/components/faq";
import Cta from "@/components/cta";
import Footer from "@/components/footer";
import CartFab from "@/components/cart-fab";
import ItemModal from "@/components/item-modal";
import CartModal from "@/components/cart-modal";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Experiences />
        <MenuSections />
        <Catering />
        <Delivery />
        <Story />
        <Reviews />
        <Shipping />
        <Faq />
        <Cta />
      </main>
      <Footer />
      <CartFab />
      <ItemModal />
      <CartModal />
    </>
  );
}
