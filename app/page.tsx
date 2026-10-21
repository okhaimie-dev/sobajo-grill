import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Experiences from "@/components/experiences";
import MenuSections from "@/components/menu-sections";
import Catering from "@/components/catering";
import Delivery from "@/components/delivery";
import Shipping from "@/components/shipping";
import Story from "@/components/story";
import Reviews from "@/components/reviews";
import Cta from "@/components/cta";
import Footer from "@/components/footer";
import CartFab from "@/components/cart-fab";
import ItemModal from "@/components/item-modal";
import CartModal from "@/components/cart-modal";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <main>
        <Experiences />
        <MenuSections />
        <Catering />
        <Delivery />
        <Shipping />
        <Story />
        <Reviews />
        <Cta />
      </main>
      <Footer />
      <CartFab />
      <ItemModal />
      <CartModal />
    </>
  );
}
