import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Admin client — full access via service role key (for server actions, admin pages)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

// Public client — uses anon key when available, falls back to service role
// To fully separate, add NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and set up RLS
export const supabasePublic = createClient(supabaseUrl, anonKey || serviceRoleKey);

// Backward-compatible alias
export const supabase = supabaseAdmin;
