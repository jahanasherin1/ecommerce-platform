'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import Sidebar from '@/components/Sidebar';

// --- MOCK DATA (To match your Figma design) ---
const PERFORMANCE_STATS = [
  { label: 'Total Sales', value: '$4,280', change: '+12.5%', icon: '💰' },
  { label: 'Orders', value: '156', change: '+8%', icon: '📦' },
  { label: 'Revenue', value: '$3,120', change: '+14%', icon: '📈' },
  { label: 'Visitors', value: '2,840', change: '+5%', icon: '👥' },
];

const RECENT_CHECKOUTS = [
  { customer: 'Sarah Miller', amount: '₹120.00', time: '2 mins ago', initial: 'S' },
  { customer: 'John Doe', amount: '₹850.00', time: '15 mins ago', initial: 'J' },
  { customer: 'Emma Wilson', amount: '₹2,400.00', time: '1 hour ago', initial: 'E' },
];

export default function SellerDashboard() {
  const [storeName, setStoreName] = useState('Loading...');
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchStoreData = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      // Fetch user and store name
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('seller_profiles')
          .select('business_name')
          .eq('id', user.id)
          .single();
        
        if (data?.business_name) {
          setStoreName(data.business_name);
        } else {
          setStoreName('My Store');
        }
      } else {
        setStoreName('My Store');
      }

      // Fetch top products (let's pick the latest 3 active products as "top" for now)
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (products) {
        setTopProducts(products.map(p => ({
          name: p.name,
          price: `₹${p.price.toFixed(2)}`,
          sold: `${Math.floor(Math.random() * 20)} sold`, // Mocking sold count as we lack an orders table
          image: p.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80'
        })));
      }
    };

    fetchStoreData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-gray-900">
      
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* HEADER BAR */}
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold">Store Overview</h2>
          <div className="flex items-center gap-4">
             <button className="p-3 bg-white rounded-full border border-gray-100 shadow-sm relative">
                🔔 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             <Link href="/add-product">
  <button className="bg-[#67a769] text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-[#568f58] transition-all shadow-lg shadow-green-100">
    <span>+</span> Add Product
  </button>
</Link>
          </div>
        </header>

        {/* WELCOME HERO (From Figma) */}
        <div className="bg-gradient-to-r from-[#c2e1c5] to-[#e8f5e9] p-10 rounded-[40px] relative overflow-hidden mb-10">
          <div className="relative z-10 max-w-md">
            <h3 className="text-3xl font-bold text-gray-800 mb-3">Welcome to your Store Dashboard</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Start setting up your store to begin selling products to your customers.</p>
          </div>
          <div className="absolute right-10 bottom-0 opacity-20 text-[120px]">🚀</div>
        </div>

        {/* PERFORMANCE OVERVIEW GRID (From Figma) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {PERFORMANCE_STATS.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm">
               <div className="text-xl mb-3">{stat.icon}</div>
               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
               <div className="flex items-baseline gap-2 mt-1">
                 <h4 className="text-2xl font-bold">{stat.value}</h4>
                 <span className="text-green-500 text-xs font-bold">{stat.change}</span>
               </div>
            </div>
          ))}
        </div>

        {/* MIDDLE SECTION: PERFORMANCE CHART & RECENT CHECKOUTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Sales Performance (From Figma) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-lg">Sales Performance</h3>
              <select className="bg-gray-50 border-none rounded-lg text-xs font-bold p-2 outline-none">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            {/* Mock Chart Visualization */}
            <div className="flex items-end justify-between h-48 gap-4 px-4">
              {[40, 70, 45, 90, 65, 30].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                  <div 
                    style={{ height: `${h}%` }} 
                    className={`w-full rounded-t-xl transition-all duration-500 ${h > 80 ? 'bg-[#67a769]' : 'bg-green-100 hover:bg-green-200'}`}
                  ></div>
                  <span className="text-[10px] font-bold text-gray-400">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Checkouts (From Figma) */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm">
            <h3 className="font-bold text-lg mb-6">Recent Checkouts</h3>
            <div className="space-y-6">
              {RECENT_CHECKOUTS.map((order, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#f4fbf4] rounded-full flex items-center justify-center font-bold text-[#67a769] text-sm">
                      {order.initial}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{order.customer}</p>
                      <p className="text-[10px] text-gray-400">{order.time}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-700">{order.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TOP PERFORMING PRODUCTS (From Figma) */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-lg">Top Performing</h3>
            <button className="text-[#67a769] text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topProducts.length > 0 ? (
              topProducts.map((product, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="relative h-48 w-full rounded-[32px] overflow-hidden mb-4">
                    <img src={product.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={product.name} />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold">
                      {product.sold}
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-800 line-clamp-1">{product.name}</h4>
                  <p className="text-[#67a769] font-bold text-sm mt-1">{product.price}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-3 text-sm">No products found.</p>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function SidebarLink({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-[20px] transition-all text-sm font-bold ${
        active 
          ? 'bg-[#f4fbf4] text-[#67a769]' 
          : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
}