import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative bg-cover bg-center h-[70vh]" style={{backgroundImage: "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&h=1080')"}}>
      <div className="absolute inset-0 bg-neutral-dark bg-opacity-60"></div>
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-white font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Discover Your True Beauty</h1>
          <p className="text-white text-lg md:text-xl mb-8">Premium salon services and beauty products at Beauty Villa.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent-dark text-white">
              <Link href="/services">Book Appointment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white hover:bg-gray-100 text-accent">
              <Link href="/products">Shop Products</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
