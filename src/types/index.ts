// src/types/index.ts
export interface ProductVariation {
  id: string;
  color: string;
  stockQuantity: number;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  variations: ProductVariation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterParams {
  name?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
}