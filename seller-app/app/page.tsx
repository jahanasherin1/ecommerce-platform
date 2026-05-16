import { createClient } from '../utils/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function SellerDashboard() {
  const supabase = await createClient();

  // 1. Fetch existing products from the database
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false });

  // 2. SERVER ACTION: This function runs securely on the backend when the form is submitted
  const addProduct = async (formData: FormData) => {
    'use server'
    const title = formData.get('title') as string;
    const price = formData.get('price') as string;
    const description = formData.get('description') as string;

    const supabase = await createClient();
    
    // Insert the new product into Supabase
    const { error } = await supabase.from('products').insert([
      { title, price, description }
    ]);

    if (error) console.error("Error adding product:", error.message);
    
    // Refresh the page to show the new product
    revalidatePath('/');
  }

  // 3. The User Interface (UI)
  return (
    <main style={{ padding: '50px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>🏪 Seller Dashboard</h1>
      
      {/* FORM TO ADD A PRODUCT */}
      <div style={{ backgroundColor: '#f4f4f5', padding: '20px', borderRadius: '8px', marginBottom: '40px' }}>
        <h2>Add a New Product</h2>
        <form action={addProduct} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" name="title" placeholder="Product Name (e.g. iPhone 15)" required style={{ padding: '10px' }} />
          <input type="number" name="price" placeholder="Price (e.g. 999)" required style={{ padding: '10px' }} />
          <textarea name="description" placeholder="Product Description..." style={{ padding: '10px', height: '80px' }}></textarea>
          <button type="submit" style={{ padding: '10px', backgroundColor: '#000', color: '#fff', cursor: 'pointer' }}>
            Save Product
          </button>
        </form>
      </div>

      {/* LIST OF PRODUCTS ALREADY ADDED */}
      <div>
        <h2>Your Products</h2>
        {products?.length === 0 ? (
          <p>No products added yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {products?.map((product) => (
              <li key={product.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
                <h3>{product.title} - ${product.price}</h3>
                <p>{product.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}