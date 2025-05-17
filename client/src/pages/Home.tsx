import Hero from "@/components/home/Hero";
import ServicesSection from "@/components/home/ServicesSection";
import ProductsSection from "@/components/home/ProductsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Beauty Villa - Premium Salon & Beauty Products</title>
        <meta name="description" content="Beauty Villa offers premium salon services and beauty products. Book your appointment or shop our exclusive collection today." />
      </Helmet>
      
      <Hero />
      <ServicesSection />
      <ProductsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
};

export default Home;
