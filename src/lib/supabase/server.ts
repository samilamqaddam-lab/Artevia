import {createClient, type SupabaseClient} from '@supabase/supabase-js';
import type {Database} from './types';

let cachedClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient() {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Supabase environment variables are not configured.');
  }

  cachedClient = createClient<Database>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return cachedClient;
}
