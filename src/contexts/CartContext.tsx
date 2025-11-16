"use client"
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { IProduct } from '@/models/product';

// Define CartItem interface for the cart context
interface CartItem {
  product: IProduct;
  quantity: number;
  selectedColor?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: IProduct; quantity: number; selectedColor?: string } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0
};

// Helper function to safely get product price
const getProductPrice = (product: IProduct): number => {
  if (product.price && typeof product.price === 'object' && 'original' in product.price && typeof product.price.original === 'number') {
    return product.price.original;
  }
  if (typeof product.price === 'number') {
    return product.price;
  }
  return 0;
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, selectedColor } = action.payload;
      const existingItem = state.items.find(
        item => item.product._id?.toString() === product._id?.toString() && item.selectedColor === selectedColor
      );

      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.product._id?.toString() === product._id?.toString() && item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product, quantity, selectedColor }];
      }

      const total = newItems.reduce((sum, item) => sum + (getProductPrice(item.product) * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product._id?.toString() !== action.payload);
      const total = newItems.reduce((sum, item) => sum + (getProductPrice(item.product) * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: productId });
      }

      const newItems = state.items.map(item =>
        item.product._id?.toString() === productId ? { ...item, quantity } : item
      );
      const total = newItems.reduce((sum, item) => sum + (getProductPrice(item.product) * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  addItem: (product: IProduct, quantity?: number, selectedColor?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
} | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (product: IProduct, quantity = 1, selectedColor?: string) => {
    const cartData = {
      action: 'ADD_TO_CART',
      product: {
        id: product._id?.toString(),
        name: product.name,
        price: getProductPrice(product),
        category: product.categoryName,
        stock: product.stock
      },
      quantity,
      selectedColor,
      timestamp: new Date().toISOString(),
      totalValue: getProductPrice(product) * quantity
    };
    
    console.log('Cart Action - Add Item:', cartData);
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, selectedColor } });
  };

  const removeItem = (productId: string) => {
    const removeData = {
      action: 'REMOVE_FROM_CART',
      productId,
      timestamp: new Date().toISOString()
    };
    
    console.log('Cart Action - Remove Item:', removeData);
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const updateData = {
      action: 'UPDATE_CART_QUANTITY',
      productId,
      quantity,
      timestamp: new Date().toISOString()
    };
    
    console.log('Cart Action - Update Quantity:', updateData);
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    const clearData = {
      action: 'CLEAR_CART',
      timestamp: new Date().toISOString()
    };
    
    console.log('Cart Action - Clear Cart:', clearData);
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
