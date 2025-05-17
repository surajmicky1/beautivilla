import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Star, StarHalf, User } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  isApproved: boolean;
  userId: number | null;
  createdAt: string;
}

const TestimonialsSection = () => {
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  // Helper function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-amber-400 text-amber-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-amber-400 text-amber-400" />);
    }

    return stars;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-primary bg-opacity-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">What Our Clients Say</h2>
            <p className="text-neutral-medium max-w-2xl mx-auto">Read testimonials from our satisfied customers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="bg-white shadow">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-1/3"></div>
                  <div className="h-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="ml-3">
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-24 mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !testimonials || testimonials.length === 0) {
    return (
      <section className="py-16 bg-primary bg-opacity-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">What Our Clients Say</h2>
          <p className="text-neutral-medium max-w-2xl mx-auto">{error ? 'Failed to load testimonials. Please try again later.' : 'No testimonials available yet.'}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-primary bg-opacity-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">What Our Clients Say</h2>
          <p className="text-neutral-medium max-w-2xl mx-auto">Read testimonials from our satisfied customers.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial) => (
            <Card key={testimonial.id} className="bg-white p-6 rounded-lg shadow">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="text-amber-400 flex">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                <p className="text-neutral-medium mb-4">{testimonial.content}</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-neutral-medium">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
