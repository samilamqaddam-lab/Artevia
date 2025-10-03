'use client';

import {createBrowserSupabaseClient} from '@supabase/auth-helpers-nextjs';
import type {SupabaseClient} from '@supabase/supabase-js';
import type {Database} from './types';

let client: SupabaseClient<Database> | undefined;

export function getBrowserSupabaseClient() {
  if (!client) {
    client = createBrowserSupabaseClient<Database>();
  }
  return client;
}
