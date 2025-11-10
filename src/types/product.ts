export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem extends Product {
  quantity: number;
}
