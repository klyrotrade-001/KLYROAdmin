export type ProductCategory = 
  | 'Mini Electronics'
  | 'Baby Products & Toys'
  | 'Mini Nebulizers'
  | 'Tools'
  | 'Kitchen Items';

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  categorySlug: string;
  price: number;
  originalPrice: number;
  discount: number;
  description: string;
  fullDescription?: string;
  features: string[];
  specs?: Record<string, string>;
  images: string[];
  variants?: ProductVariant[];
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface CustomerDetails {
  fullName: string;
  mobileNumber: string;
  email?: string;
  houseBuilding: string;
  streetLocality: string;
  city: string;
  state: string;
  pinCode: string;
  landmark?: string;
  orderNotes?: string;
}

export interface CategoryInfo {
  id: string;
  name: ProductCategory;
  slug: string;
  description: string;
  itemCount: number;
  image: string;
}

