import { createClient } from '@supabase/supabase-js';

// Supabase Configuration using user provided credentials
export const SUPABASE_URL = "https://wpqttbdtsolbydffawzg.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_fdjIevVQlLyNmfqOJX7YaQ_hG-z-pVq";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper function to test DB connection safely
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('platform_settings').select('id').limit(1);
    if (error) {
      console.warn('Supabase DB notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase connection error:', err);
    return false;
  }
}
