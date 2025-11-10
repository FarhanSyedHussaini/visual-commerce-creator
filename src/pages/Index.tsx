import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { ProductGrid } from "@/components/ProductGrid";
import { Cart } from "@/components/Cart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Store } from "lucide-react";
import { toast } from "sonner";

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load products");
      console.error("Error fetching products:", error);
    } else {
      setProducts(data || []);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data?.map((p) => p.category).filter(Boolean) as string[])
      );
      setCategories(uniqueCategories);
    }
    setLoading(false);
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">ShopHub</h1>
          </div>
          <Cart />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 rounded-lg bg-gradient-to-r from-primary to-primary/80 p-8 text-primary-foreground md:p-12">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Welcome to ShopHub
          </h2>
          <p className="mb-6 text-lg opacity-90 md:text-xl">
            Discover amazing products at great prices
          </p>
        </section>

        {/* Search and Filter */}
        <section className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(searchQuery || selectedCategory !== "all") && (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </section>

        {/* Products */}
        <section>
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <p className="text-lg text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-muted/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 ShopHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
