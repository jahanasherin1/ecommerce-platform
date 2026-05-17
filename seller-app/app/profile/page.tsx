'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { createBrowserClient } from '@supabase/ssr';

export default function ProfilePage() {
  const [storeName, setStoreName] = useState('Loading...');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
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
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-gray-900">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        </header>

        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm max-w-2xl">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-[#e8f5e9] rounded-2xl flex items-center justify-center text-4xl text-[#67a769]">
              👤
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{storeName}</h2>
              <p className="text-gray-500 font-medium mt-1">{email}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">Business Name</label>
              <input type="text" disabled value={storeName} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">Contact Email</label>
              <input type="text" disabled value={email} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
