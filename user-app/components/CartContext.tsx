'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: any) => void;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('user_cart');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  const addToCart = (product: any) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      const price = product.selling_price || product.price || 0;
      let newItems;
      if (existing) {
        newItems = prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newItems = [...prev, { id: product.id, name: product.name, price: Number(price), quantity: 1 }];
      }
      localStorage.setItem('user_cart', JSON.stringify(newItems));
      
      // Simple feedback
      alert(`Added ${product.name} to cart!`);
      return newItems;
    });
  };

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
