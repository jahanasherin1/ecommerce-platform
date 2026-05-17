'use client';

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserRegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'buyer', // Tag them as a buyer
        },
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      alert("Registration successful! Welcome to MyStore.");
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] bg-white rounded-[32px] shadow-sm border border-gray-100 p-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#67a769] rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">🛍️</div>
          <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
          <p className="text-gray-500 mt-2 text-sm">Sign up to track orders and save your wishlist.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input type="text" placeholder="John Doe" required className="w-full px-5 py-3.5 rounded-2xl bg-[#f4fbf4] border-none focus:ring-2 focus:ring-[#67a769] outline-none transition-all" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input type="email" placeholder="you@example.com" required className="w-full px-5 py-3.5 rounded-2xl bg-[#f4fbf4] border-none focus:ring-2 focus:ring-[#67a769] outline-none transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input type="password" placeholder="Min. 6 characters" required minLength={6} className="w-full px-5 py-3.5 rounded-2xl bg-[#f4fbf4] border-none focus:ring-2 focus:ring-[#67a769] outline-none transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#67a769] hover:bg-[#568f58] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-green-100">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500 font-medium">
          Already have an account? <Link href="/login" className="text-[#67a769] font-bold hover:underline ml-1">Sign In</Link>
        </p>
      </div>
    </div>
  );
}