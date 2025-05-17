import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  isActive: boolean;
}

const ServicesSection = () => {
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Our Services</h2>
            <p className="text-neutral-medium max-w-2xl mx-auto">Experience the ultimate in beauty treatments with our professional salon services.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="bg-neutral-light rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="h-7 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-20 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Our Services</h2>
          <p className="text-red-500">Failed to load services. Please try again later.</p>
        </div>
      </section>
    );
  }

  // Display only the first 3 services on homepage
  const displayServices = services?.slice(0, 3) || [];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Our Services</h2>
          <p className="text-neutral-medium max-w-2xl mx-auto">Experience the ultimate in beauty treatments with our professional salon services.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service) => (
            <Card key={service.id} className="bg-neutral-light rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <img className="w-full h-64 object-cover" src={service.image} alt={service.name} />
              <CardContent className="p-6">
                <h3 className="font-display text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-neutral-medium mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-accent font-semibold">From ${service.price.toFixed(2)}</span>
                  <Link href={`/services#book-${service.id}`}>
                    <Button className="bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-md text-sm font-medium">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="border-2 border-accent text-accent hover:bg-accent hover:text-white font-medium">
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
