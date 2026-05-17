'use client';

import React from 'react';
import { useCart } from './CartContext';

export function CartIcon() {
  const { cartCount } = useCart();

  return (
    <button onClick={() => alert("Cart Page coming soon!")} className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
      {cartCount > 0 && (
        <span className="absolute top-0 right-0 w-4 h-4 bg-[#67a769] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
          {cartCount}
        </span>
      )}
    </button>
  );
}

export function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();

  return (
    <button 
      disabled={product.stock <= 0}
      onClick={() => addToCart(product)}
      className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-[#67a769] transition-colors disabled:opacity-50 disabled:hover:bg-gray-900"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
      </svg>
    </button>
  );
}
