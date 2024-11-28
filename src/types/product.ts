// src/types/product.ts
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
  
  // src/store/productsSlice.ts
  import { createSlice, PayloadAction } from '@reduxjs/toolkit';
  import { Product } from '../types/product';
  
  interface ProductsState {
    items: Product[];
    loading: boolean;
    error: string | null;
  }
  
  const initialState: ProductsState = {
    items: [],
    loading: false,
    error: null,
  };
  
  const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
      addProduct: (state, action: PayloadAction<Product>) => {
        state.items.push(action.payload);
      },
      updateProduct: (state, action: PayloadAction<Product>) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      },
      removeProduct: (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      },
    },
  });
  
  export const { addProduct, updateProduct, removeProduct } = productsSlice.actions;
  export default productsSlice.reducer;
  
  // src/store/store.ts
  import { configureStore } from '@reduxjs/toolkit';
  import productsReducer from './productsSlice';
  
  export const store = configureStore({
    reducer: {
      products: productsReducer,
    },
  });
  
  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;