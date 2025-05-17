import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  price: number;
  image: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
}

const ProductsSection = () => {
  const { toast } = useToast();
  
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products/featured'],
  });

  const handleAddToCart = (product: Product) => {
    // In a real implementation, this would add to a cart state or context
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Featured Products</h2>
            <p className="text-neutral-medium max-w-2xl mx-auto">Shop our handpicked selection of premium beauty products.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition">
                <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                  <div className="h-16 bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-28 bg-gray-200 rounded animate-pulse"></div>
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Featured Products</h2>
          <p className="text-red-500">Failed to load products. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Featured Products</h2>
          <p className="text-neutral-medium max-w-2xl mx-auto">Shop our handpicked selection of premium beauty products.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <Card key={product.id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition">
              <div className="relative">
                <img className="w-full h-64 object-cover" src={product.image} alt={product.name} />
                {product.isFeatured && (
                  <Badge className="absolute top-2 right-2 bg-accent text-white">NEW</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-display text-lg font-semibold mb-1">{product.name}</h3>
                <p className="text-neutral-medium text-sm mb-2">{product.brand}</p>
                <p className="text-neutral-medium text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-accent font-semibold">${product.price.toFixed(2)}</span>
                  <Button 
                    onClick={() => handleAddToCart(product)} 
                    size="sm" 
                    className="bg-accent hover:bg-accent-dark text-white"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="border-2 border-accent text-accent hover:bg-accent hover:text-white font-medium">
            <Link href="/products">Shop All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
