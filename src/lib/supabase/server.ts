import {createServerClient} from '@supabase/ssr';
import {createClient, type SupabaseClient} from '@supabase/supabase-js';
import {cookies} from 'next/headers';
import type {Database} from './types';

/**
 * Creates a Supabase client for Server Components/API Routes that reads cookies.
 * This client respects user authentication and RLS policies.
 * IMPORTANT: Call this function for each request - do NOT cache the result.
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({name, value, options}) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        }
      }
    }
  );
}

/**
 * Legacy function for backward compatibility.
 * Now returns a client that reads cookies.
 */
export function getSupabaseClient() {
  return createServerSupabaseClient();
}

/**
 * Creates a Supabase service role client for admin operations.
 * This client bypasses RLS and should only be used for trusted operations.
 * Use with caution!
 */
let cachedServiceClient: SupabaseClient<Database> | null = null;

export function getSupabaseServiceClient() {
  if (cachedServiceClient) return cachedServiceClient;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Supabase environment variables are not configured.');
  }

  cachedServiceClient = createClient<Database>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return cachedServiceClient;
}
