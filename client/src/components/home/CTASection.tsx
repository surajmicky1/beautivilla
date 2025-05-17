import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Experience Beauty Villa?</h2>
        <p className="text-white text-lg max-w-2xl mx-auto mb-8">Book your appointment today or browse our exclusive collection of beauty products.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" variant="outline" className="bg-white hover:bg-gray-100 text-secondary">
            <Link href="/services">Book Appointment</Link>
          </Button>
          <Button asChild size="lg" className="bg-accent hover:bg-accent-dark text-white">
            <Link href="/products">Shop Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
