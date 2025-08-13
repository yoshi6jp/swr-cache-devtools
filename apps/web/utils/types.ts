export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  inStock: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  category: string;
  sortBy: string;
  limit: number;
}

export interface Analytics {
  totalProducts: number;
  averagePrice: number;
  averageRating: number;
  inStock: number;
}

export interface AnalyticsResponse {
  category: string;
  analytics: Analytics;
  timestamp: string;
  requestId: string;
}
