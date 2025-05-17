import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { 
  Card,
  CardContent 
} from "@/components/ui/card";
import { 
  Button 
} from "@/components/ui/button";
import { 
  Badge 
} from "@/components/ui/badge";
import { ShoppingCart, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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

const Products = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("new");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch products
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const handleAddToCart = (product: Product) => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  // Filter and sort products
  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || 
                         product.brand.toLowerCase().includes(search.toLowerCase()) ||
                         product.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesBrand && matchesPrice;
  }) || [];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "price-low") return a.price - b.price;
    if (sort === "price-high") return b.price - a.price;
    if (sort === "name") return a.name.localeCompare(b.name);
    return 0; // Default: newest
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique brands for filter
  const brands = [...new Set(products?.map(p => p.brand) || [])];

  // Generate a hero image
  const heroImage = "https://images.unsplash.com/photo-1631214240010-a1a9d0e4b1a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&h=1080";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-light">
        <div className="relative bg-cover bg-center h-[40vh]" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="absolute inset-0 bg-neutral-dark bg-opacity-60"></div>
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-white font-display text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
              <p className="text-white text-lg md:text-xl">Shop our handpicked selection of premium beauty products.</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <Card key={index} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition">
                    <Skeleton className="w-full h-64" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-1" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-16 w-full mb-3" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-9 w-28" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-light">
        <div className="relative bg-cover bg-center h-[40vh]" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="absolute inset-0 bg-neutral-dark bg-opacity-60"></div>
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-white font-display text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
              <p className="text-white text-lg md:text-xl">Shop our handpicked selection of premium beauty products.</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-red-500 text-lg">Failed to load products. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shop Beauty Products - Beauty Villa</title>
        <meta name="description" content="Shop our collection of premium beauty products including skincare, haircare, makeup, and fragrances. Free shipping on orders over $50." />
      </Helmet>

      <div className="min-h-screen bg-neutral-light">
        <div className="relative bg-cover bg-center h-[40vh]" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="absolute inset-0 bg-neutral-dark bg-opacity-60"></div>
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-white font-display text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
              <p className="text-white text-lg md:text-xl">Shop our handpicked selection of premium beauty products.</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          {/* Search and Filter Bar */}
          <div className="mb-8 bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" /> Filter
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Filter Products</SheetTitle>
                    <SheetDescription>
                      Narrow down products by price and brand
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Price Range</h3>
                      <div className="px-1">
                        <Slider
                          value={priceRange}
                          min={0}
                          max={200}
                          step={5}
                          onValueChange={setPriceRange}
                          className="my-6"
                        />
                        <div className="flex justify-between">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Brands</h3>
                      <div className="space-y-2">
                        {brands.map(brand => (
                          <div key={brand} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`brand-${brand}`} 
                              checked={selectedBrands.includes(brand)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedBrands([...selectedBrands, brand]);
                                } else {
                                  setSelectedBrands(selectedBrands.filter(b => b !== brand));
                                }
                              }}
                            />
                            <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => {
                        setPriceRange([0, 200]);
                        setSelectedBrands([]);
                      }}
                      variant="outline" 
                      className="w-full"
                    >
                      Reset Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="w-full">
              {currentProducts.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                  <p className="text-lg text-neutral-medium">No products found matching your filters.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {currentProducts.map((product) => (
                      <Card key={product.id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition h-full flex flex-col">
                        <div className="relative">
                          <img className="w-full h-64 object-cover" src={product.image} alt={product.name} />
                          {product.isFeatured && (
                            <Badge className="absolute top-2 right-2 bg-accent text-white">NEW</Badge>
                          )}
                        </div>
                        <CardContent className="p-4 flex flex-col flex-grow">
                          <h3 className="font-display text-lg font-semibold mb-2">{product.name}</h3>
                          <p className="text-neutral-medium text-sm mb-2">{product.brand}</p>
                          <p className="text-neutral-medium text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
                          <div className="flex justify-between items-center mt-auto">
                            <span className="text-accent font-semibold text-lg">${product.price.toFixed(2)}</span>
                            <Button 
                              onClick={() => handleAddToCart(product)} 
                              size="sm" 
                              className="bg-accent hover:bg-accent-dark text-white flex items-center gap-1"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              Add to Cart
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination className="mt-8">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        
                        {[...Array(totalPages)].map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              isActive={currentPage === i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
