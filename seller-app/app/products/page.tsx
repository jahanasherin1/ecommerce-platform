'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function ProductsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize Supabase Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    // Fetch products from 'products' table.
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      // Fallback/Mock data if table doesn't exist yet so UI still works based on design
      const defaultMockData = [
        { id: 1, name: 'AeroPeak Smartwatch Series 5', price: 2499, stock: 130, status: 'Active', image_url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=200&h=200' },
        { id: 2, name: 'Studio Pro Noise Cancelling', price: 4999, stock: 10, status: 'Low Stock', image_url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=200&h=200' },
        { id: 3, name: 'Lumina X1 Retro Camera', price: 50999, stock: 100, status: 'Active', image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200&h=200' },
        { id: 4, name: 'Sprint Elite V2 Running Shoes', price: 25500, stock: 0, status: 'Out of Stock', image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200&h=200' },
      ];
      
      const localProducts = JSON.parse(localStorage.getItem('mock_products') || '[]');
      setProducts([...localProducts, ...defaultMockData]);
    } else {
      const localProducts = JSON.parse(localStorage.getItem('mock_products') || '[]');
      setProducts([...localProducts, ...(data || [])]);
    }
    setLoading(false);
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-500 bg-red-50';
    if (stock <= 10) return 'text-orange-500 bg-orange-50';
    return 'text-gray-400';
  };

  const getStockText = (stock: number) => {
    if (stock === 0) return 'Stock out';
    if (stock <= 10) return `${stock} left`;
    return `${stock} in Stock`;
  };

  const getBadge = (stock: number) => {
    if (stock === 0) return <span className="px-2 py-0.5 bg-gray-200 text-gray-500 rounded text-[10px] font-bold uppercase">Out of Stock</span>;
    if (stock <= 10) return <span className="px-2 py-0.5 bg-red-100 text-red-500 rounded text-[10px] font-bold uppercase">Low Stock</span>;
    return null;
  };

  const filters = ['All', 'Active', 'Low Stock', 'Drafts'];

  const filteredProducts = products.filter(p => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Active') return p.stock > 10;
    if (activeFilter === 'Low Stock') return p.stock > 0 && p.stock <= 10;
    if (activeFilter === 'Drafts') return p.stock === 0; // Simple mockup
    return true;
  });

  const handleDelete = (id: any) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    // Also remove from local storage if it was a custom product
    const localProducts = JSON.parse(localStorage.getItem('mock_products') || '[]');
    const filteredLocal = localProducts.filter((p: any) => p.id !== id);
    localStorage.setItem('mock_products', JSON.stringify(filteredLocal));
  };

  const handleEdit = (product: any) => {
    // Store the product to be edited in localStorage so the add-product page can pick it up
    localStorage.setItem('editing_product', JSON.stringify(product));
    router.push('/add-product');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-gray-900">
      
      {/* SIDEBAR (Desktop Navigation matching Dashboard) */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen hidden md:flex">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#67a769] rounded-xl flex items-center justify-center text-white text-xl">🛍️</div>
            <div>
              <h1 className="font-bold text-lg leading-tight">My Products</h1>
            </div>
          </div>

          <nav className="space-y-2">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all font-bold text-sm">
              <span className="text-xl">📊</span> Dashboard
            </Link>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#f4fbf4] text-[#67a769] font-bold text-sm">
              <span className="text-xl">🛍️</span> Products
            </div>
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-10">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>
            <button 
              onClick={() => router.push('/add-product')}
              className="bg-[#67a769] text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-green-100 hover:bg-[#568f58] transition-all transform active:scale-95 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Product
            </button>
          </header>

          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
            {/* Search Bar matching the design */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Search by name, category, ..." 
                className="w-full bg-[#f4fbf4] rounded-2xl py-4 pl-12 pr-4 outline-none text-sm font-bold text-gray-800 border-2 border-transparent focus:border-[#c2e1c5] transition-all placeholder-gray-400"
              />
            </div>

            {/* Filter Pills matching the design */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 rounded-full font-bold text-xs whitespace-nowrap transition-all ${
                    activeFilter === filter 
                      ? 'bg-[#67a769] text-white shadow-md shadow-green-100' 
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Product List */}
            {loading ? (
              <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#67a769]"></div></div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 rounded-3xl border border-gray-100 hover:border-[#c2e1c5] hover:shadow-sm transition-all group bg-white">
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={product.image_url || 'https://via.placeholder.com/150'} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-bold text-gray-800 text-sm md:text-base leading-tight">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-bold text-[#67a769] text-sm">₹ {product.price}</span>
                          {getBadge(product.stock)}
                        </div>
                        <a href="#" className="flex items-center gap-1 text-[10px] font-bold text-red-400 hover:text-red-500 mt-2 uppercase tracking-widest">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                           </svg>
                           View Ratings
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-4 h-full justify-between pr-2">
                       <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleEdit(product)} className="text-gray-400 hover:text-blue-500 transition-colors">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                             <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                           </svg>
                         </button>
                         <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                             <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                           </svg>
                         </button>
                       </div>
                       <span className={`text-[10px] font-bold ${getStockColor(product.stock)} px-2 py-1 rounded-md`}>
                         {getStockText(product.stock)}
                       </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
