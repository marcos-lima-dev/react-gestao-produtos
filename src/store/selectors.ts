// src/store/selectors.ts
import { RootState } from './store';
import { Product } from '../types';

interface FilterParams {
  name?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const selectFilteredProducts = (state: RootState, filters: FilterParams): Product[] => {
  return state.products.items.filter(product => {
    const matchesName = !filters.name || 
      product.name.toLowerCase().includes(filters.name.toLowerCase());
    
    const matchesColor = !filters.color || 
      product.variations.some(v => v.color.toLowerCase().includes(filters.color!.toLowerCase()));
    
    const matchesPrice = product.variations.some(v => {
      const minPrice = filters.minPrice ?? 0;
      const maxPrice = filters.maxPrice ?? Infinity;
      return v.price >= minPrice && v.price <= maxPrice;
    });

    return matchesName && matchesColor && matchesPrice;
  });
};