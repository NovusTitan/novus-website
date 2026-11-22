import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

// Supabase client for Client Components (acts as the logged-in user; RLS applies).
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
