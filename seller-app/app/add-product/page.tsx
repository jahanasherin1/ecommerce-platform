'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function AddProductWeb() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<any[]>([]);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);
  const [currentVariant, setCurrentVariant] = useState({ name: '', value: '', stock: '', price: '' });
  const [customFields, setCustomFields] = useState<{ id: number }[]>([]);

  // Form States
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [editingId, setEditingId] = useState<any>(null);

  // Additional Content States
  const [description, setDescription] = useState('');
  const [caption, setCaption] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [brandName, setBrandName] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [material, setMaterial] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [sustainability, setSustainability] = useState('');
  const [careInstructions, setCareInstructions] = useState('');
  const [primaryCategory, setPrimaryCategory] = useState('');
  const [sectionCategory, setSectionCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [discountType, setDiscountType] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [minDays, setMinDays] = useState('');
  const [maxDays, setMaxDays] = useState('');

  useEffect(() => {
    const productToEdit = localStorage.getItem('editing_product');
    if (productToEdit) {
      const p = JSON.parse(productToEdit);
      setProductName(p.name || '');
      setPrice(p.price?.toString() || '');
      setStock(p.stock?.toString() || '');
      setEditingId(p.id);
      if (p.image_url && !p.image_url.startsWith('https://images.unsplash.com')) {
        setImagePreviews(Array.isArray(p.image_url) ? p.image_url : [p.image_url]);
      } else if (p.images && Array.isArray(p.images)) {
        setImagePreviews(p.images);
      }
      
      // Load all additional fields
      setDescription(p.description || '');
      setCaption(p.caption || '');
      setOriginalPrice(p.originalPrice || '');
      setBrandName(p.brandName || '');
      setCountryOfOrigin(p.countryOfOrigin || '');
      setMaterial(p.material || '');
      setSize(p.size || '');
      setColor(p.color || '');
      setDimensions(p.dimensions || '');
      setSustainability(p.sustainability || '');
      setCareInstructions(p.careInstructions || '');
      setPrimaryCategory(p.primaryCategory || '');
      setSectionCategory(p.sectionCategory || '');
      setSubCategory(p.subCategory || '');
      setDiscountType(p.discountType || '');
      setDiscountValue(p.discountValue || '');
      setMinDays(p.minDays || '');
      setMaxDays(p.maxDays || '');
      if (p.variants) setVariants(p.variants);
      if (p.customFields) setCustomFields(p.customFields);
      if (typeof p.offersEnabled === 'boolean') setOffersEnabled(p.offersEnabled);
      if (typeof p.imagesVisible === 'boolean') setImagesVisible(p.imagesVisible);

      localStorage.removeItem('editing_product');
    }
  }, []);

  const handleSaveVariant = () => {
    if (!currentVariant.name || !currentVariant.value) return;
    if (editingVariantIndex !== null) {
      const updatedVariants = [...variants];
      updatedVariants[editingVariantIndex] = currentVariant;
      setVariants(updatedVariants);
    } else {
      setVariants([...variants, currentVariant]);
    }
    setCurrentVariant({ name: '', value: '', stock: '', price: '' });
    setShowVariantForm(false);
    setEditingVariantIndex(null);
  };

  const handleEditVariant = (index: number) => {
    setCurrentVariant(variants[index]);
    setEditingVariantIndex(index);
    setShowVariantForm(true);
  };

  const handleDeleteVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const [offersEnabled, setOffersEnabled] = useState(true);
  const [imagesVisible, setImagesVisible] = useState(true);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSaveProduct = async () => {
    // Save to localStorage for demo purposes until Supabase is connected
    const existingProducts = JSON.parse(localStorage.getItem('mock_products') || '[]');
    
    const productData = {
      name: productName || 'Unnamed Product',
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      status: Number(stock) > 0 ? 'Active' : 'Out of Stock',
      image_url: imagePreviews.length > 0 ? imagePreviews[0] : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200&h=200',
      images: imagePreviews,
      description,
      caption,
      originalPrice,
      brandName,
      countryOfOrigin,
      material,
      size,
      color,
      dimensions,
      sustainability,
      careInstructions,
      primaryCategory,
      sectionCategory,
      subCategory,
      discountType,
      discountValue,
      minDays,
      maxDays,
      variants,
      customFields,
      offersEnabled,
      imagesVisible
    };

    if (editingId) {
      // Update existing
      const updatedProducts = existingProducts.map((p: any) => 
        p.id === editingId ? { ...p, ...productData } : p
      );
      localStorage.setItem('mock_products', JSON.stringify(updatedProducts));
    } else {
      // Create new
      const newProduct = { id: Date.now(), ...productData };
      localStorage.setItem('mock_products', JSON.stringify([newProduct, ...existingProducts]));
    }
    
    // basic Supabase attempt:
    try {
      if (editingId) {
        await supabase.from('products').update({ name: productName, price: Number(price), stock: Number(stock) }).eq('id', editingId);
      } else {
        await supabase.from('products').insert([
          { name: productName, price: Number(price), stock: Number(stock) }
        ]);
      }
    } catch (e) {
      console.log('Supabase table missing, relying on localStorage mock');
    }

    router.push('/products');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-[#67a769]">Add New Product</h1>
          </div>
          <div className="flex gap-4">
            <button onClick={() => window.location.reload()} className="px-8 py-3 rounded-full font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">Discard</button>
            <button onClick={handleSaveProduct} type="button" className="px-10 py-3 bg-[#67a769] text-white rounded-full font-bold shadow-lg shadow-green-100 hover:bg-[#568f58] transition-all transform active:scale-95">
              Save Product
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 mt-10">
        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Main Details */}
          <div className="lg:col-span-2 space-y-6">
            
            <SectionWrapper title="Product Name & Description" icon="📝">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Product Name</label>
                  <input type="text" placeholder="Product name" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full p-4 rounded-2xl bg-[#f4fbf4] outline-none border-2 border-transparent focus:border-[#c2e1c5] transition-all text-gray-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Full Description</label>
                  <textarea rows={8} placeholder="Product description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-4 rounded-2xl bg-[#f4fbf4] outline-none border-2 border-transparent focus:border-[#c2e1c5] transition-all resize-none text-gray-800"></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Product Caption</label>
                  <input type="text" placeholder="Product caption" value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full p-4 rounded-2xl bg-[#f4fbf4] outline-none border-2 border-transparent focus:border-[#c2e1c5] transition-all text-gray-800 mb-4" />
                  
                  <div 
                    className="flex items-center justify-between p-4 bg-[#f4fbf4] rounded-2xl cursor-pointer"
                    onClick={() => setImagesVisible(!imagesVisible)}
                  >
                      <span className="text-sm font-bold text-gray-700">Uploading images & making it visible to customers</span>
                      <button 
                        type="button" 
                        className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${imagesVisible ? 'bg-[#67a769]' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${imagesVisible ? 'left-6' : 'left-1'}`}></div>
                      </button>
                  </div>
                </div>
              </div>
            </SectionWrapper>

            <SectionWrapper title="Product Images" icon="🖼️">
              <div className="grid grid-cols-4 gap-4">
                <label className="col-span-4 h-64 border-2 border-dashed border-[#c2e1c5] rounded-[32px] flex flex-col items-center justify-center bg-[#f9fbf9] hover:bg-green-50 transition-all cursor-pointer group">
                  <input type="file" multiple accept="image/png, image/jpeg, image/jpg" className="hidden" onChange={handleImageChange} />
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform text-[#67a769] text-2xl">☁️</div>
                  <p className="font-bold text-gray-600">Click to browse or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">PNG, JPG up to 10MB</p>
                </label>
                {/* Image Thumbnails Placeholder */}
                {imagePreviews.map((src, i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center relative overflow-hidden group/image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setImagePreviews(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-400 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </SectionWrapper>

            <SectionWrapper 
              title="Additional Details" 
              icon="✨"
              action={
                <button 
                  type="button"
                  onClick={() => setCustomFields([...customFields, { id: Date.now() }])}
                  className="flex items-center gap-2 text-[#67a769] font-bold text-sm hover:text-[#568f58] transition-all group"
                >
                  <div className="w-6 h-6 rounded-full bg-[#f4fbf4] group-hover:bg-[#c2e1c5] transition-colors flex items-center justify-center text-lg shrink-0">+</div>
                  Add Field
                </button>
              }
            >
              <div className="grid grid-cols-2 gap-6">
                <InputGroup label="Brand Name" placeholder="e.g. Rolex" value={brandName} onChange={(e: any) => setBrandName(e.target.value)} />
                <InputGroup label="Country of Origin" placeholder="e.g. India" value={countryOfOrigin} onChange={(e: any) => setCountryOfOrigin(e.target.value)} />
                <InputGroup label="Material" placeholder="e.g. Stainless Steel" value={material} onChange={(e: any) => setMaterial(e.target.value)} />
                <InputGroup label="Size" placeholder="e.g. M, L, XL" value={size} onChange={(e: any) => setSize(e.target.value)} />
                <InputGroup label="Color" placeholder="e.g. Silver/Gold" value={color} onChange={(e: any) => setColor(e.target.value)} />
                <InputGroup label="Dimensions" placeholder="e.g. 41mm Case" value={dimensions} onChange={(e: any) => setDimensions(e.target.value)} />
                <InputGroup label="Sustainability" placeholder="e.g. Recycled Packaging" value={sustainability} onChange={(e: any) => setSustainability(e.target.value)} />
                <InputGroup label="Care Instructions" placeholder="e.g. Wipe with soft cloth" value={careInstructions} onChange={(e: any) => setCareInstructions(e.target.value)} />
                {customFields.map((field, i) => (
                  <div key={field.id} className="relative">
                    <div className="flex justify-between items-center mb-1.5">
                      <input 
                        type="text" 
                        placeholder="CUSTOM LABEL"
                        value={(field as any).label || ''}
                        onChange={(e) => {
                          const newFields = [...customFields];
                          (newFields[i] as any).label = e.target.value;
                          setCustomFields(newFields);
                        }}
                        className="block text-[10px] font-bold text-gray-800 uppercase ml-1 tracking-widest bg-transparent border-b border-dashed border-gray-300 focus:border-[#67a769] outline-none w-[70%] placeholder-gray-400"
                      />
                      <button 
                        type="button" 
                        onClick={() => setCustomFields(customFields.filter(f => f.id !== field.id))}
                        className="text-red-400 hover:text-red-500 text-xs font-bold px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      >
                        ✕ Remove
                      </button>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Value"
                      value={(field as any).value || ''}
                      onChange={(e) => {
                        const newFields = [...customFields];
                        (newFields[i] as any).value = e.target.value;
                        setCustomFields(newFields);
                      }}
                      className="w-full p-3.5 rounded-xl bg-[#f4fbf4] border-2 border-transparent focus:border-[#c2e1c5] outline-none transition-all text-sm font-medium text-gray-800" 
                    />
                  </div>
                ))}
              </div>
            </SectionWrapper>
          </div>

          {/* RIGHT COLUMN: Settings & Logistics */}
          <div className="space-y-6">
            
            <SectionWrapper title="Pricing & Stock" icon="💰">
              <div className="space-y-4">
                <InputGroup label="Original Price (₹)" placeholder="0.00" type="number" value={originalPrice} onChange={(e: any) => setOriginalPrice(e.target.value)} />
                <InputGroup label="Selling Price (₹)" placeholder="0.00" type="number" value={price} onChange={(e: any) => setPrice(e.target.value)} />
                <InputGroup label="Available Stock" placeholder="0" type="number" value={stock} onChange={(e: any) => setStock(e.target.value)} />
                <div className="bg-[#f4fbf4] rounded-2xl mt-4 overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => setOffersEnabled(!offersEnabled)}
                  >
                      <span className="text-sm font-bold text-gray-700">Offers & Discounts</span>
                      <button 
                        type="button" 
                        className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${offersEnabled ? 'bg-[#67a769]' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${offersEnabled ? 'left-6' : 'left-1'}`}></div>
                      </button>
                  </div>
                  {offersEnabled && (
                    <div className="px-4 pb-4 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1 tracking-widest">Discount Type</label>
                        <div className="relative">
                          <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="w-full p-3 rounded-xl bg-white border-2 border-transparent focus:border-[#c2e1c5] outline-none transition-all text-xs font-bold appearance-none cursor-pointer text-gray-800">
                            <option value="">Select Type</option>
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount (₹)</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1 tracking-widest">Discount Value</label>
                        <input type="number" placeholder="0" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="w-full p-3 rounded-xl bg-white border-2 border-transparent focus:border-[#c2e1c5] outline-none transition-all text-sm font-bold text-gray-800" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </SectionWrapper>

            <SectionWrapper title="Categorization" icon="📂">
              <div className="space-y-4">
                <SelectGroup label="Primary Category" value={primaryCategory} onChange={(e: any) => setPrimaryCategory(e.target.value)} options={['Electronics', 'Fashion', 'Home & Garden', 'Beauty & Health', 'Sports & Outdoors', 'Toys & Games', 'Automotive', 'Books', 'Groceries', 'Pet Supplies', 'Office Products', 'Music & Instruments', 'Industrial & Scientific', 'Handmade', 'Video Games']} />
                <SelectGroup label="Section" value={sectionCategory} onChange={(e: any) => setSectionCategory(e.target.value)} options={['Men', 'Women', 'Unisex', 'Kids', 'Baby', 'Teens', 'Toddlers', 'Maternity', 'Seniors', 'Pets', 'General']} />
                <SelectGroup label="Sub Category" value={subCategory} onChange={(e: any) => setSubCategory(e.target.value)} options={['Watches', 'Shoes', 'Jewelry', 'Clothing', 'Bags & Accessories', 'Smartphones', 'Laptops', 'Tablets', 'Cameras', 'Audio & Headphones', 'Home Decor', 'Kitchenware', 'Furniture', 'Bedding', 'Bath', 'Fitness Gear', 'Outdoor Recreation', 'Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Diet & Nutrition', 'Pet Food', 'Stationery']} />
              </div>
            </SectionWrapper>

            <SectionWrapper title="Product Variants" icon="🎨">
              <div className="space-y-4">
                {variants.length > 0 && (
                  <div className="space-y-2">
                    {variants.map((v, i) => (
                       <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-bold transition-all hover:border-[#c2e1c5]">
                          <div className="flex flex-col">
                            <span className="text-gray-800">{v.name}: {v.value}</span>
                            <span className="text-gray-500 font-medium mt-0.5">Stock: {v.stock || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[#67a769] text-sm">+₹{v.price || '0'}</span>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => handleEditVariant(i)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" /></svg>
                              </button>
                              <button type="button" onClick={() => handleDeleteVariant(i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" /></svg>
                              </button>
                            </div>
                          </div>
                       </div>
                    ))}
                  </div>
                )}
                <button 
                  type="button"
                  onClick={() => {
                    setShowVariantForm(!showVariantForm);
                    if (!showVariantForm) {
                      setCurrentVariant({ name: '', value: '', stock: '', price: '' });
                      setEditingVariantIndex(null);
                    }
                  }}
                  className="w-full py-3 border-2 border-dashed border-[#c2e1c5] rounded-2xl text-[#67a769] font-bold text-sm hover:bg-green-50 transition-all"
                >
                  {showVariantForm ? 'Cancel' : '+ Add Variant'}
                </button>
                {showVariantForm && (
                  <div className="p-4 bg-[#f4fbf4] rounded-2xl border border-[#c2e1c5] space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1 tracking-widest">Variant Name</label>
                        <input type="text" placeholder="e.g. Size" value={currentVariant.name} onChange={(e) => setCurrentVariant({...currentVariant, name: e.target.value})} className="w-full p-2.5 rounded-xl bg-white border-2 border-transparent focus:border-[#c2e1c5] text-sm text-gray-800 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1 tracking-widest">Value</label>
                        <input type="text" placeholder="e.g. Large" value={currentVariant.value} onChange={(e) => setCurrentVariant({...currentVariant, value: e.target.value})} className="w-full p-2.5 rounded-xl bg-white border-2 border-transparent focus:border-[#c2e1c5] text-sm text-gray-800 outline-none transition-all" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1 tracking-widest">Stock</label>
                        <input type="number" placeholder="0" value={currentVariant.stock} onChange={(e) => setCurrentVariant({...currentVariant, stock: e.target.value})} className="w-full p-2.5 rounded-xl bg-white border-2 border-transparent focus:border-[#c2e1c5] text-sm text-gray-800 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1 tracking-widest">Extra Price</label>
                        <input type="number" placeholder="0.00" value={currentVariant.price} onChange={(e) => setCurrentVariant({...currentVariant, price: e.target.value})} className="w-full p-2.5 rounded-xl bg-white border-2 border-transparent focus:border-[#c2e1c5] text-sm text-gray-800 outline-none transition-all" />
                      </div>
                    </div>
                    <button type="button" onClick={handleSaveVariant} className="w-full bg-[#67a769] hover:bg-[#568f58] transition-colors text-white py-3 rounded-xl text-sm font-bold mt-2">
                       {editingVariantIndex !== null ? 'Save Changes' : 'Confirm Variant'}
                    </button>
                  </div>
                )}
              </div>
            </SectionWrapper>

            <SectionWrapper title="Shipping" icon="🚚">
               <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Estimated Delivery</label>
               <div className="grid grid-cols-2 gap-3">
                 <div className="relative">
                   <select value={minDays} onChange={(e) => setMinDays(e.target.value)} className="w-full p-3 rounded-xl bg-[#f4fbf4] text-xs font-bold outline-none appearance-none text-gray-800">
                      <option value="">Min days</option>
                      <option value="1">1 Day</option>
                      <option value="2">2 Days</option>
                      <option value="3">3 Days</option>
                      <option value="5">5 Days</option>
                   </select>
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                     </svg>
                   </div>
                 </div>
                 <div className="relative">
                   <select value={maxDays} onChange={(e) => setMaxDays(e.target.value)} className="w-full p-3 rounded-xl bg-[#f4fbf4] text-xs font-bold outline-none appearance-none text-gray-800">
                      <option value="">Max days</option>
                      <option value="3">3 Days</option>
                      <option value="5">5 Days</option>
                      <option value="7">7 Days</option>
                      <option value="14">14 Days</option>
                   </select>
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                     </svg>
                   </div>
                 </div>
               </div>
            </SectionWrapper>

          </div>
        </form>
      </main>
    </div>
  );
}

// Helper Components
function SectionWrapper({ title, icon, action, children }: any) {
  return (
    <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#67a769] rounded-full"></div>
          <span className="text-xl">{icon}</span>
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
}

function InputGroup({ label, placeholder, type = "text", value, onChange }: any) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 ml-1 tracking-widest">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value}
        onChange={onChange}
        className="w-full p-3.5 rounded-xl bg-[#f4fbf4] border-2 border-transparent focus:border-[#c2e1c5] outline-none transition-all text-sm font-medium text-gray-800" 
      />
    </div>
  );
}

function SelectGroup({ label, options, value, onChange }: any) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 ml-1 tracking-widest">{label}</label>
      <div className="relative">
        <select value={value} onChange={onChange} className="w-full p-3.5 rounded-xl bg-[#f4fbf4] border-2 border-transparent focus:border-[#c2e1c5] outline-none transition-all text-sm font-medium appearance-none cursor-pointer text-gray-800">
          <option value="">Select {label}</option>
          {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}