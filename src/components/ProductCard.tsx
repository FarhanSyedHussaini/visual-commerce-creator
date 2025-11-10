import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onClick={handleCardClick}
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1">{product.name}</CardTitle>
          {product.category && (
            <Badge variant="secondary" className="shrink-0">
              {product.category}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
