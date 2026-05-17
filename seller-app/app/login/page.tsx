'use client';

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // --- REAL-TIME VALIDATION LOGIC ---
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailError = email.length > 0 && !emailRegex.test(email) 
    ? "Please enter a valid email address." : "";
    
  const passwordError = password.length > 0 && password.length < 6 
    ? "Password must be at least 6 characters." : "";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Block submission if any real-time errors exist
    if (emailError || passwordError) {
      return; 
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message); // Shows "Invalid login credentials" if they type the wrong password
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f9f1] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-200 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-60" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-100 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl opacity-60" />

      <div className="relative w-full max-w-[450px] bg-white rounded-[40px] shadow-2xl p-10 border border-green-50">
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">Enterprise</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Login to your account</h1>
          <p className="text-gray-500 mt-3 text-sm">
            Access your multi-vendor dashboard and manage your store templates.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Business Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Business Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-5 py-4 rounded-2xl bg-[#f4fbf4] border-none focus:ring-2 focus:ring-green-500 outline-none transition-all text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {/* Real-time error text */}
            {emailError && <p className="text-red-500 text-xs mt-1.5 ml-1">{emailError}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-5 py-4 rounded-2xl bg-[#f4fbf4] border-none focus:ring-2 focus:ring-green-500 outline-none transition-all text-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Real-time error text */}
            {passwordError && <p className="text-red-500 text-xs mt-1.5 ml-1">{passwordError}</p>}
          </div>

          <div className="text-right">
            <button type="button" className="text-sm text-gray-400 hover:text-green-600">Forget Password?</button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#67a769] hover:bg-[#568f58] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            {loading ? 'Processing...' : 'Login'} 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest text-gray-400 bg-white px-4">Social Login</div>
        </div>

        <button className="w-full border border-gray-200 py-3 rounded-full flex items-center justify-center gap-3 hover:bg-gray-50 transition-all font-semibold text-gray-600">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="google" />
          Sign in with google
        </button>

        <p className="text-center mt-8 text-sm text-gray-400">
          Establish your presence. <Link href="/register" className="text-[#67a769] font-bold hover:underline">Register Business</Link>
        </p>
      </div>
    </div>
  );
}