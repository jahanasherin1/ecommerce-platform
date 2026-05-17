'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function Sidebar() {
  const pathname = usePathname();
  const [storeName, setStoreName] = useState('Loading...');

  useEffect(() => {
    const fetchStoreName = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
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
    };

    fetchStoreName();
  }, []);

  const navLinks = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Products', href: '/products', icon: '🛍️' },
    { name: 'Orders', href: '/orders', icon: '🚚' },
    { name: 'Profile', href: '/profile', icon: '👤' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen hidden md:flex">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#67a769] rounded-xl flex items-center justify-center text-white text-xl">🏠</div>
          <div>
            <h1 className="font-bold text-lg leading-tight">{storeName}</h1>
            <span className="text-[10px] font-bold text-[#67a769] uppercase tracking-widest">Premium Vendor</span>
          </div>
        </div>

        <nav className="space-y-2">
          {navLinks.map((link) => {
            // Basic matching for active state
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                  isActive ? 'bg-[#f4fbf4] text-[#67a769]' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{link.icon}</span> {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-gray-50">
        <button className="flex items-center gap-3 text-gray-400 hover:text-red-500 transition-all font-medium text-sm">
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
