export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail?: string;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Meta {
  barcode?: string;
  qrCode?: string;
  [key: string]: unknown;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images?: string[];
  reviews?: Review[];
  colors?: string[];
  sizes?: string[];
  shippingInformation?: string;
  warrantyInformation?: string;
  availabilityStatus?: string;
  dimensions?: Dimensions;
  tags?: string[];
  meta?: Meta;
  sku?: string;
  weight?: number;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
}

export interface ProductsListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface APIResponse<T> {
  data: T;
} 