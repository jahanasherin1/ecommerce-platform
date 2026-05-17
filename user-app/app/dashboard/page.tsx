'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('orders');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-900 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-100 p-8 h-auto md:h-screen sticky top-0">
        <Link href="/" className="flex items-center gap-2 mb-10 cursor-pointer">
          <div className="w-8 h-8 bg-[#67a769] rounded-lg flex items-center justify-center text-white text-sm">🛍️</div>
          <span className="text-xl font-bold tracking-tight">MyStore</span>
        </Link>

        <nav className="space-y-2">
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'orders' ? 'bg-[#f4fbf4] text-[#67a769]' : 'text-gray-500 hover:bg-gray-50'}`}>
            📦 My Orders
          </button>
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'profile' ? 'bg-[#f4fbf4] text-[#67a769]' : 'text-gray-500 hover:bg-gray-50'}`}>
            👤 Profile Info
          </button>
        </nav>

        <button onClick={handleLogout} className="mt-10 flex items-center gap-3 px-4 py-3 text-red-500 font-bold text-sm hover:bg-red-50 w-full rounded-2xl transition-all">
          🚪 Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-8">Hello, {user.user_metadata?.full_name || 'Shopper'}! 👋</h2>

        {activeTab === 'orders' && (
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-xl mb-6">Recent Orders</h3>
            {/* Mock Order List */}
            <div className="space-y-4">
              <div className="p-4 border border-gray-100 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Order #847291</p>
                  <p className="font-bold text-gray-800">1x AeroPeak Smartwatch Series 5</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#67a769]">₹2499.00</p>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold uppercase">Delivered</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm max-w-xl">
            <h3 className="font-bold text-xl mb-6">Account Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
                <input type="text" disabled value={user.email} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Full Name</label>
                <input type="text" disabled value={user.user_metadata?.full_name || ''} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-600" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}