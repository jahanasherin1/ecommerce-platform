'use client';

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function SetupProfileWeb() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    gstin: '',
    whatsapp: '',
    email: '',
    address: '',
    place: '',
    city: '',
    state: '',
    district: '',
    pincode: '',
    description: ''
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Real-time Validations
  const gstinError = formData.gstin.length > 0 && formData.gstin.length !== 15 ? "GSTIN must be 15 characters." : "";
  const whatsappError = formData.whatsapp.length > 0 && formData.whatsapp.length !== 10 ? "Enter a valid 10-digit number." : "";
  const pincodeError = formData.pincode.length > 0 && formData.pincode.length !== 6 ? "Pincode must be 6 digits." : "";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gstinError || whatsappError || pincodeError) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('seller_profiles').upsert({
      id: user?.id,
      business_name: formData.businessName,
      category: formData.category,
      gstin: formData.gstin,
      whatsapp_number: formData.whatsapp,
      business_email: formData.email,
      shop_address: formData.address,
      place: formData.place,
      city: formData.city,
      state: formData.state,
      district: formData.district,
      pincode: formData.pincode,
      description: formData.description,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-3 mb-4 mt-2">
      <div className="w-1 h-5 bg-[#67a769] rounded-full"></div>
      <h2 className="font-bold text-sm text-gray-700 uppercase tracking-wide">{title}</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Web Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="hover:bg-gray-100 p-2 rounded-full transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-800">Setup Business Profile</h1>
          </div>
          <div className="text-xs text-gray-400 font-medium italic">Step 2 of 2: Store Customization</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-8 px-6">
        <form onSubmit={handleSave} className="bg-white shadow-sm border border-gray-100 rounded-[32px] overflow-hidden">
          
          <div className="p-8 md:p-12">
            
            {/* Top Grid: Media & Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
              <div className="md:col-span-1 flex flex-col items-center justify-center border-r border-gray-50 pr-4">
                 <div className="w-32 h-32 rounded-full border-2 border-[#c2e1c5] flex items-center justify-center relative bg-[#f4fbf4] mb-4">
                    <span className="text-gray-400 font-bold text-xs">LOGO</span>
                    <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md border border-gray-100 cursor-pointer hover:bg-green-50 transition-all">
                      <input type="file" className="hidden" />
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#67a769" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                      </svg>
                    </label>
                 </div>
                 <p className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter">Business Logo</p>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <SectionHeader title="Business Name" />
                    <input 
                      type="text" placeholder="Enter business name" required
                      className="w-full p-3.5 rounded-xl bg-[#f4fbf4] outline-none border border-transparent focus:border-green-500 transition-all text-gray-800"
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    />
                  </div>
                  <div className="col-span-1">
                    <SectionHeader title="Category" />
                    <select 
                      required className="w-full p-3.5 rounded-xl bg-[#f4fbf4] outline-none border border-transparent focus:border-green-500 appearance-none cursor-pointer text-gray-800"
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="">Select category</option>
                      <option value="electronics">Electronics</option>
                      <option value="fashion">Fashion</option>
                      <option value="grocery">Grocery & Food</option>
                      <option value="home">Home & Kitchen</option>
                      <option value="beauty">Beauty & Personal Care</option>
                      <option value="sports">Sports & Outdoors</option>
                      <option value="books">Books & Media</option>
                      <option value="toys">Toys & Games</option>
                      <option value="furniture">Furniture</option>
                      <option value="automotive">Automotive</option>
                      <option value="health">Health & Wellness</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <SectionHeader title="GST Number" />
                    <input 
                      type="text" placeholder="15 Digit GSTIN" maxLength={15}
                      className="w-full p-3.5 rounded-xl bg-[#f4fbf4] outline-none border border-transparent focus:border-green-500 text-gray-800"
                      onChange={(e) => setFormData({...formData, gstin: e.target.value.toUpperCase()})}
                    />
                    {gstinError && <p className="text-red-500 text-[10px] mt-1 ml-2 font-medium">{gstinError}</p>}
                  </div>
                </div>
              </div>
            </div>

            <hr className="mb-10 border-gray-50" />

            {/* Banner & Description Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              <div>
                <SectionHeader title="Store Banner" />
                <div className="w-full h-44 border-2 border-dashed border-green-100 rounded-3xl flex flex-col items-center justify-center bg-[#f9fbf9] hover:bg-green-50 transition-all group cursor-pointer">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#67a769" className="w-8 h-8 opacity-40 mb-2 group-hover:scale-110 transition-transform">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                   </svg>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Recommended: 1200x400</p>
                </div>
              </div>
              <div>
                <SectionHeader title="About Business" />
                <textarea 
                  placeholder="Describe what your store sells..." rows={6}
                  className="w-full p-4 rounded-3xl bg-[#f4fbf4] outline-none border border-transparent focus:border-green-500 resize-none text-sm text-gray-800"
                  onChange={(e)=>setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
            </div>

            {/* Contact & Address Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <SectionHeader title="Contact Info" />
                  <div className="space-y-4">
                    <input 
                      type="tel" placeholder="WhatsApp Number" maxLength={10}
                      className="w-full p-3.5 rounded-xl bg-[#f4fbf4] outline-none border border-transparent focus:border-green-500 text-gray-800"
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value.replace(/\D/g,'')})}
                    />
                    {whatsappError && <p className="text-red-500 text-[10px] font-medium">{whatsappError}</p>}
                    <input 
                      type="email" placeholder="Public Business Email"
                      className="w-full p-3.5 rounded-xl bg-[#f4fbf4] outline-none border border-transparent focus:border-green-500 text-gray-800"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <SectionHeader title="Location Details" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Shop/Building Address" className="col-span-2 p-3.5 rounded-xl bg-[#f4fbf4] outline-none border border-transparent focus:border-green-500 text-gray-800" onChange={(e)=>setFormData({...formData, address: e.target.value})}/>
                  <input type="text" placeholder="Place" className="p-3.5 rounded-xl bg-[#f4fbf4] outline-none border border-transparent focus:border-green-500 text-gray-800" onChange={(e)=>setFormData({...formData, place: e.target.value})}/>
                  <input type="text" placeholder="City" className="p-3.5 rounded-xl bg-[#f4fbf4] outline-none border border-transparent focus:border-green-500 text-gray-800" onChange={(e)=>setFormData({...formData, city: e.target.value})}/>
                  <input type="text" placeholder="State" className="p-3.5 rounded-xl bg-[#f4fbf4] outline-none border border-transparent focus:border-green-500 text-gray-800" onChange={(e)=>setFormData({...formData, state: e.target.value})}/>
                  <input 
                    type="text" placeholder="Pincode" maxLength={6}
                    className="p-3.5 rounded-xl bg-[#f4fbf4] outline-none border border-transparent focus:border-green-500 text-gray-800"
                    onChange={(e)=>setFormData({...formData, pincode: e.target.value.replace(/\D/g,'')})}
                  />
                  {pincodeError && <p className="text-red-500 text-[10px] col-span-2 font-medium">{pincodeError}</p>}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-16 flex flex-col items-center">
              <button 
                disabled={loading}
                className="w-full md:w-64 bg-[#67a769] hover:bg-[#568f58] text-white py-4 rounded-full font-bold shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-3 transform active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Save & Continue'}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <p className="mt-6 text-[11px] text-gray-400 max-w-xs text-center leading-relaxed">
                By clicking Save, you agree to our <span className="underline cursor-pointer">Marketplace Seller Agreement</span> and confirm all provided tax info is accurate.
              </p>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}