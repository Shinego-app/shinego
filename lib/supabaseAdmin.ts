import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;
console.log("Admin key type",supabaseSecretKey.startsWith("sb_secret_"));

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseSecretKey
);