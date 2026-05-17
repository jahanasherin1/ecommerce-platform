'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-gray-900">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        </header>

        <div className="bg-white rounded-[32px] p-16 text-center border border-gray-100 shadow-sm">
          <div className="text-6xl mb-4">🚚</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            When customers place orders, they will appear here.
          </p>
        </div>
      </main>
    </div>
  );
}
