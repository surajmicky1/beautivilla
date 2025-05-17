import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-display text-2xl font-semibold mb-4">Beauty Villa</h3>
            <p className="text-white mb-4">Your destination for premium beauty services and products.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-accent transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-accent transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-accent transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-accent transition">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-white hover:text-accent transition">Home</Link></li>
              <li><Link href="/services" className="text-white hover:text-accent transition">Services</Link></li>
              <li><Link href="/products" className="text-white hover:text-accent transition">Products</Link></li>
              <li><Link href="/about" className="text-white hover:text-accent transition">About Us</Link></li>
              <li><Link href="/contact" className="text-white hover:text-accent transition">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-2">
              <li><Link href="/services#hair" className="text-white hover:text-accent transition">Hair Styling</Link></li>
              <li><Link href="/services#facial" className="text-white hover:text-accent transition">Facial Treatments</Link></li>
              <li><Link href="/services#nail" className="text-white hover:text-accent transition">Nail Services</Link></li>
              <li><Link href="/services#makeup" className="text-white hover:text-accent transition">Makeup</Link></li>
              <li><Link href="/services#body" className="text-white hover:text-accent transition">Body Treatments</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <address className="not-italic text-white">
              <p className="mb-2">123 Beauty Street</p>
              <p className="mb-2">New York, NY 10001</p>
              <p className="mb-2">Phone: (123) 456-7890</p>
              <p>Email: info@beautyvilla.com</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-6 mt-6 text-center text-white text-sm">
          <p>&copy; {new Date().getFullYear()} Beauty Villa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
