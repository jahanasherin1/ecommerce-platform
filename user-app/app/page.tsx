import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  // 1. Connect to Supabase
  const supabase = await createClient();

  // 2. Fetch the data from the test table we made earlier
  const { data, error } = await supabase.from('test_connection').select('*');

  // 3. PRINT TO THE VS CODE TERMINAL
  console.log("====================================");
  if (error) {
    console.log("❌ BACKEND CONNECTION ERROR:", error.message);
  } else {
    console.log("✅ BACKEND CONNECTION SUCCESS!");
    console.log("📦 DATA FROM SUPABASE:", data);
  }
  console.log("====================================");

  // 4. Simple screen UI
  return (
    <main style={{ padding: '50px' }}>
      <h1>Look at your VS Code Terminal! 👀</h1>
    </main>
  );
}