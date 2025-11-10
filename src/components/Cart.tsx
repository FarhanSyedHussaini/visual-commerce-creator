import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {getCartCount() > 0 && (
            <Badge
              className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
              variant="default"
            >
              {getCartCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {getCartCount() === 0
              ? "Your cart is empty"
              : `${getCartCount()} item${getCartCount() !== 1 ? "s" : ""} in your cart`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground">Start shopping to add items to your cart</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex justify-between">
                      <h4 className="font-semibold">{item.name}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-bold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <>
            <Separator />
            <SheetFooter className="flex-col gap-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={clearCart} className="flex-1">
                  Clear Cart
                </Button>
                <Button className="flex-1">Checkout</Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
