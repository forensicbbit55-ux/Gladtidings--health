/**
 * Product type definitions for the wellness/herbal remedies store
 */

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  stock: number;
  created_at: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  category?: string;
  image_url?: string;
  stock?: number;
}

export interface ProductResponse {
  success: boolean;
  data?: Product | Product[];
  error?: string;
  message?: string;
}

export interface ProductListResponse {
  success: boolean;
  data: Product[];
  pagination?: {
    limit: number;
    offset: number;
    total?: number;
  };
  error?: string;
}
