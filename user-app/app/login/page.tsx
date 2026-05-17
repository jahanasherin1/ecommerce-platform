'use client';

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh(); // Refresh to update the navbar state
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] bg-white rounded-[32px] shadow-sm border border-gray-100 p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2 text-sm">Sign in to your MyStore account.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input type="email" placeholder="you@example.com" required className="w-full px-5 py-3.5 rounded-2xl bg-[#f4fbf4] border-none focus:ring-2 focus:ring-[#67a769] outline-none transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input type="password" placeholder="Enter password" required className="w-full px-5 py-3.5 rounded-2xl bg-[#f4fbf4] border-none focus:ring-2 focus:ring-[#67a769] outline-none transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#67a769] hover:bg-[#568f58] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-green-100">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500 font-medium">
          Don't have an account? <Link href="/register" className="text-[#67a769] font-bold hover:underline ml-1">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}