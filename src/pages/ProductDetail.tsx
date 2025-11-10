import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        toast.error("Failed to load product");
        console.error("Error fetching product:", error);
      } else if (data) {
        setProduct(data);
      } else {
        toast.error("Product not found");
        navigate("/");
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                {product.category && (
                  <Badge variant="secondary">{product.category}</Badge>
                )}
              </div>
              <p className="text-4xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold">Description</h2>
              <p className="text-muted-foreground">
                {product.description || "No description available"}
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold">Availability</h2>
              <p className="text-muted-foreground">
                {product.stock > 0
                  ? `${product.stock} items in stock`
                  : "Out of stock"}
              </p>
            </div>

            {product.stock > 0 && (
              <div className="space-y-4">
                <div>
                  <h2 className="mb-2 text-lg font-semibold">Quantity</h2>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center text-lg font-semibold">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
