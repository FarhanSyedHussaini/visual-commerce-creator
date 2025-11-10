# ShopHub E-Commerce Platform - Technical Architecture

## Overview
ShopHub is a modern, full-stack e-commerce platform built with React, TypeScript, and Lovable Cloud (Supabase backend).

## Technology Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **TanStack Query** - Server state management

### Backend (Lovable Cloud)
- **PostgreSQL** - Relational database
- **Supabase** - Backend infrastructure
- **Row Level Security (RLS)** - Data security

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── Cart.tsx         # Shopping cart drawer
│   ├── ProductCard.tsx  # Product card component
│   └── ProductGrid.tsx  # Product grid layout
├── contexts/            # React Context providers
│   └── CartContext.tsx  # Shopping cart state management
├── pages/               # Route pages
│   ├── Index.tsx        # Home/Shop page
│   ├── ProductDetail.tsx # Product detail page
│   └── NotFound.tsx     # 404 page
├── types/               # TypeScript type definitions
│   └── product.ts       # Product and cart types
├── integrations/        # Backend integrations (auto-generated)
│   └── supabase/        # Supabase client and types
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── App.tsx             # Root component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles and design tokens
```

## Database Schema

### Products Table
```sql
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

**Security:**
- RLS enabled
- Public read access (SELECT policy)
- Automatic timestamp updates via trigger

## Core Features

### 1. Product Catalog
- **Location:** `src/pages/Index.tsx`
- **Features:**
  - Product grid with responsive layout
  - Real-time product data from database
  - Category filtering
  - Search functionality
  - Stock availability display

### 2. Product Details
- **Location:** `src/pages/ProductDetail.tsx`
- **Features:**
  - Full product information
  - Quantity selector
  - Add to cart with stock validation
  - Dynamic routing (`/product/:id`)

### 3. Shopping Cart
- **Location:** `src/components/Cart.tsx`
- **State Management:** `src/contexts/CartContext.tsx`
- **Features:**
  - Add/remove items
  - Update quantities
  - Real-time total calculation
  - Stock validation
  - Persistent cart state (in-memory)
  - Sheet/drawer UI component

### 4. State Management
The cart uses React Context API for global state:
```typescript
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}
```

## Design System

### Color Palette
Defined in `src/index.css`:

**Light Mode:**
- Primary: `hsl(142 76% 36%)` - Emerald green
- Accent: `hsl(24 95% 53%)` - Orange
- Background: `hsl(0 0% 100%)` - White
- Foreground: `hsl(240 10% 3.9%)` - Dark gray

**Dark Mode:**
- Primary: `hsl(142 70% 45%)` - Lighter emerald
- Accent: `hsl(24 95% 53%)` - Orange
- Background: `hsl(240 10% 3.9%)` - Dark gray
- Foreground: `hsl(0 0% 98%)` - Off-white

### Design Tokens
```css
--gradient-primary: linear-gradient(135deg, hsl(142 76% 36%), hsl(142 76% 46%));
--gradient-accent: linear-gradient(135deg, hsl(24 95% 53%), hsl(24 95% 63%));
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

## Data Flow

### Product Loading
1. Component mounts → `useEffect` triggers
2. Supabase query fetches products
3. State updates with product data
4. UI renders product grid

### Add to Cart Flow
1. User clicks "Add to Cart"
2. `CartContext.addToCart()` called
3. Stock validation performed
4. Cart state updated
5. Toast notification displayed
6. Cart badge updates

### Search & Filter
1. User inputs search query or selects category
2. `filterProducts()` function runs
3. Products filtered by name/description and category
4. Filtered results displayed in grid

## API Integration

### Supabase Client
```typescript
import { supabase } from "@/integrations/supabase/client";

// Fetch products
const { data, error } = await supabase
  .from("products")
  .select("*")
  .order("created_at", { ascending: false });
```

## Routing Structure

```
/ (Index)              → Product catalog page
/product/:id           → Product detail page
* (NotFound)           → 404 error page
```

## Environment Variables
Auto-configured by Lovable Cloud:
```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
```

## Development Workflow

### Running Locally
```bash
npm install
npm run dev
```

### Database Changes
- Use Lovable Cloud migration tool for schema changes
- RLS policies ensure data security
- Types auto-generated in `src/integrations/supabase/types.ts`

## Security Considerations

### Row Level Security (RLS)
- Products table has public read access
- Future: Add admin policies for product management
- Future: Add user authentication for orders

### Input Validation
- Stock validation on add to cart
- Quantity limits enforced
- Type safety with TypeScript

## Future Enhancements

### Phase 1 - User Features
- [ ] User authentication
- [ ] User profiles
- [ ] Order history
- [ ] Wishlist functionality

### Phase 2 - E-Commerce Features
- [ ] Checkout flow
- [ ] Payment integration (Stripe)
- [ ] Order management
- [ ] Email notifications

### Phase 3 - Admin Features
- [ ] Admin dashboard
- [ ] Product management (CRUD)
- [ ] Inventory management
- [ ] Sales analytics

### Phase 4 - Advanced Features
- [ ] Product reviews and ratings
- [ ] Advanced search (filters, sorting)
- [ ] Product recommendations
- [ ] Multi-image galleries
- [ ] Product variants (size, color)

## Performance Optimization

### Current Optimizations
- Component-level code splitting
- Lazy loading images
- Efficient re-renders with React Context
- Optimized Supabase queries

### Future Optimizations
- Image optimization and CDN
- Pagination for product list
- Virtual scrolling for large lists
- Service worker for offline support

## Deployment
Use Lovable's built-in deployment:
1. Click "Publish" in Lovable interface
2. Frontend deploys automatically
3. Backend (Lovable Cloud) is always live

## Support & Documentation
- Lovable Docs: https://docs.lovable.dev/
- React Router: https://reactrouter.com/
- Tailwind CSS: https://tailwindcss.com/
- shadcn/ui: https://ui.shadcn.com/
