// src/store/productsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types';

const loadFromLocalStorage = (): Product[] => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  };
  
  const saveToLocalStorage = (products: Product[]) => {
    localStorage.setItem('products', JSON.stringify(products));
  };

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: loadFromLocalStorage(),
  loading: false,
  error: null
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
      saveToLocalStorage(state.items);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        saveToLocalStorage(state.items);
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    }
  }
});

export const { addProduct, updateProduct, removeProduct } = productsSlice.actions;

export default productsSlice.reducer;