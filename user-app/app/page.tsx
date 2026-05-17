import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

// Forces the page to fetch fresh data on every request
export const revalidate = 0;

export default async function Storefront() {
  const supabase = await createClient();

  // 1. Check if the user is logged in
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch store data
  const { data: storeProfile } = await supabase
    .from('seller_profiles')
    .select('business_name')
    .limit(1)
    .single();

  const storeName = storeProfile?.business_name || 'MyStore';

  // 2. Fetch products from the Supabase table
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  // If there's an error, we'll log it (helpful for debugging)
  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#67a769] rounded-xl flex items-center justify-center text-white text-xl">
              🛍️
            </div>
            <span className="text-xl font-bold tracking-tight">{storeName}</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-gray-600">
            <Link href="/" className="text-[#67a769]">Home</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Shop</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Categories</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">About</Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Shopping Cart Icon */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <span className="absolute top-0 right-0 w-4 h-4 bg-[#67a769] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                0
              </span>
            </button>

            {/* DYNAMIC AUTH BUTTON: Shows Account if logged in, Sign In if logged out */}
            {user ? (
              <Link href="/dashboard">
                <button className="bg-gray-100 text-gray-900 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-all flex items-center gap-2 border border-gray-200">
                  <span className="text-sm">👤</span> Account
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-all">
                  Sign In
                </button>
              </Link>
            )}

          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-[#f4fbf4] rounded-[40px] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between overflow-hidden relative border border-[#c2e1c5]">
          <div className="relative z-10 max-w-lg mb-10 md:mb-0">
            <span className="text-[#67a769] font-bold tracking-widest text-xs uppercase mb-4 block">New Collection</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Quality Products for Your Everyday Life.
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Shop our latest arrivals with guaranteed quality, fast shipping, and 24/7 customer support.
            </p>
            <button className="bg-[#67a769] hover:bg-[#568f58] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-green-100 transition-all transform hover:scale-105">
              Shop Now
            </button>
          </div>
          {/* Decorative Elements */}
          <div className="absolute right-10 bottom-0 opacity-10 text-[200px] leading-none pointer-events-none">✨</div>
          <div className="w-full md:w-1/2 h-64 bg-green-200 rounded-3xl overflow-hidden shadow-inner relative z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800" 
              alt="Storefront" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="max-w-7xl mx-auto px-6 py-12 mb-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
            <p className="text-gray-500">Handpicked items just for you.</p>
          </div>
          <button className="hidden md:block text-[#67a769] font-bold hover:underline">
            View All Products &rarr;
          </button>
        </div>

        {!products || products.length === 0 ? (
          // EMPTY STATE (If no products are in the database yet)
          <div className="bg-white rounded-[32px] p-16 text-center border border-gray-100 shadow-sm">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              It looks like there are no products in the store right now. Head over to your Seller Dashboard to add some!
            </p>
          </div>
        ) : (
          // ACTUAL PRODUCT GRID
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group flex flex-col bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#c2e1c5] transition-all">
                
                {/* Product Image */}
                <div className="relative w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80'} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Out of stock badge */}
                  {product.stock <= 0 && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-red-500 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                      Out of Stock
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    {product.primaryCategory || 'General'}
                  </span>
                  <h3 className="font-bold text-gray-800 leading-tight mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="font-bold text-lg text-[#67a769]">
                      ₹{product.price}
                    </span>
                    <button 
                      disabled={product.stock <= 0}
                      className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-[#67a769] transition-colors disabled:opacity-50 disabled:hover:bg-gray-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                      </svg>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm font-medium">
          &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
        </div>
      </footer>

    </div>
  );
}