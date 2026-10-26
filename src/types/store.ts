export interface Product {
  id: string;
  name: string;
  nameAr: string;
  categoryId: 'stationery' | 'computer' | 'mobile';
  categoryNameAr: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  brand: string;
  description: string;
  features: string[];
  image: string;
  tags: string[];
  badge?: string | null;
  specs?: Record<string, string>;
  images?: string[];
  slug?: string;
}

export interface Category {
  id: 'stationery' | 'computer' | 'mobile';
  name: string;
  nameAr: string;
  description: string;
  image: string;
  itemCount: number;
  popularItems: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface OrderCustomer {
  fullName: string;
  phone: string;
  governorate: string;
  address: string;
  notes?: string;
}

export interface Order {
  orderId: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponCode?: string;
  paymentMethod: 'cod' | 'whatsapp';
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  category: 'all' | 'stationery' | 'computer' | 'mobile';
  minPrice: number;
  maxPrice: number;
  brand: string;
  inStockOnly: boolean;
  sortBy: 'featured' | 'bestsellers' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

