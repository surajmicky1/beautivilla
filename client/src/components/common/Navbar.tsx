import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Products", href: "/products" },
    { label: "Contact", href: "/contact" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="text-accent font-display font-bold text-2xl">Beauty Villa</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item, index) => (
            <Link key={index} href={item.href} className={`transition font-medium ${
              location === item.href 
                ? "text-accent" 
                : "text-neutral-dark hover:text-accent"
            }`}>
              {item.label}
            </Link>
          ))}
          <Link href="/login" className="text-accent hover:text-accent-dark transition font-medium">
            Login
          </Link>
          <Link href="/register" className="bg-accent text-white px-4 py-2 rounded hover:bg-accent-dark transition font-medium">
            Register
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-neutral-dark"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            {navItems.map((item, index) => (
              <Link 
                key={index} 
                href={item.href}
                className={`py-2 transition font-medium ${
                  location === item.href 
                    ? "text-accent" 
                    : "text-neutral-dark hover:text-accent"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link 
              href="/login"
              className="text-accent py-2 hover:text-accent-dark transition font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              href="/register"
              className="bg-accent text-white py-2 px-4 text-center rounded hover:bg-accent-dark transition font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
