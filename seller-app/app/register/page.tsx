'use client';

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // --- REAL-TIME VALIDATION LOGIC ---
  const nameError = fullName.length > 0 && fullName.trim().length < 3 
    ? "Full Name must be at least 3 characters." : "";
    
  // NEW: Email format validation using Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailError = email.length > 0 && !emailRegex.test(email) 
    ? "Please enter a valid email address." : "";
    
  const phoneError = phone.length > 0 && phone.length < 10 
    ? "Phone Number must be exactly 10 digits." : "";
    
  const passwordError = password.length > 0 && password.length < 6 
    ? "Password must be at least 6 characters." : "";
    
  const matchError = confirmPassword.length > 0 && password !== confirmPassword 
    ? "Passwords do not match." : "";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Block submission if any real-time errors exist (Now includes emailError)
    if (nameError || emailError || phoneError || passwordError || matchError) {
      return; 
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    });

    if (error) {
      alert(error.message); 
      setLoading(false);
    } else {
      alert("Registration successful! You can now login.");
      router.push('/setup-profile');
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f9f1] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-200 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-60" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-100 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl opacity-60" />

      <div className="relative w-full max-w-[500px] bg-white rounded-[40px] shadow-2xl p-10 border border-green-50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-3 text-sm">
            Join our community of small businesses and shoppers.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              className="w-full px-5 py-3.5 rounded-2xl bg-[#f4fbf4] border-none focus:ring-2 focus:ring-green-500 outline-none transition-all text-gray-800"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            {nameError && <p className="text-red-500 text-xs mt-1.5 ml-1">{nameError}</p>}
          </div>

          {/* Business Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-5 py-3.5 rounded-2xl bg-[#f4fbf4] border-none focus:ring-2 focus:ring-green-500 outline-none transition-all text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {/* NEW: Real-time error text for Email */}
            {emailError && <p className="text-red-500 text-xs mt-1.5 ml-1">{emailError}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
            <input
              type="tel"
              maxLength={10}
              placeholder="Enter 10 digit number"
              className="w-full px-5 py-3.5 rounded-2xl bg-[#f4fbf4] border-none focus:ring-2 focus:ring-green-500 outline-none transition-all text-gray-800"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
              required
            />
            {phoneError && <p className="text-red-500 text-xs mt-1.5 ml-1">{phoneError}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-5 py-3.5 rounded-2xl bg-[#f4fbf4] border-none focus:ring-2 focus:ring-green-500 outline-none transition-all text-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && <p className="text-red-500 text-xs mt-1.5 ml-1">{passwordError}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full px-5 py-3.5 rounded-2xl bg-[#f4fbf4] border-none focus:ring-2 focus:ring-green-500 outline-none transition-all text-gray-800"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {matchError && <p className="text-red-500 text-xs mt-1.5 ml-1">{matchError}</p>}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 py-2">
            <input type="checkbox" required className="mt-1 accent-green-600 h-4 w-4" />
            <p className="text-xs text-gray-500 leading-relaxed">
              I agree to the <span className="text-[#67a769] font-bold cursor-pointer">Terms & Conditions</span> and <span className="text-[#67a769] font-bold cursor-pointer">Privacy Policy</span>
            </p>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#67a769] hover:bg-[#568f58] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-green-100"
          >
            {loading ? 'Creating Account...' : 'Sign up'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500 font-medium">
          Already have an account? <Link href="/login" className="text-[#67a769] font-bold hover:underline ml-1">Sign In</Link>
        </p>
      </div>
    </div>
  );
}