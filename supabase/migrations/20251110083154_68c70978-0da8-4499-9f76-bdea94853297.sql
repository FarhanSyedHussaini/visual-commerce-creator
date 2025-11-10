-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view products)
CREATE POLICY "Anyone can view products" 
ON public.products 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, description, price, image_url, category, stock) VALUES
  ('Wireless Headphones', 'Premium noise-cancelling wireless headphones with 30-hour battery life', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'Electronics', 25),
  ('Smart Watch', 'Fitness tracking smartwatch with heart rate monitor and GPS', 299.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 'Electronics', 15),
  ('Leather Backpack', 'Vintage leather backpack with laptop compartment', 149.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 'Accessories', 30),
  ('Running Shoes', 'Lightweight running shoes with advanced cushioning technology', 129.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 'Footwear', 40),
  ('Coffee Maker', 'Automatic espresso machine with milk frother', 249.99, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', 'Home', 20),
  ('Yoga Mat', 'Eco-friendly non-slip yoga mat with carrying strap', 49.99, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', 'Sports', 50);