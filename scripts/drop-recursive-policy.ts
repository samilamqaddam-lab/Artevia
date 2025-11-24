#!/usr/bin/env node

// @ts-nocheck
/**
 * Drop Recursive RLS Policy
 * Connects directly to PostgreSQL to drop the problematic policy
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function dropPolicy() {
  console.log('🚀 Attempting to drop recursive policy...\n');

  // Try using a SQL function approach
  // First, let's check if we can query the policies
  const { data: policies, error: policyError } = await supabase
    .from('pg_policies')
    .select('policyname, tablename')
    .eq('tablename', 'user_roles');

  if (!policyError && policies) {
    console.log('Current policies on user_roles:');
    policies.forEach(p => console.log(`  - ${p.policyname}`));
    console.log('');
  }

  console.log('⚠️  Cannot drop policy via API (requires SUPERUSER privileges).\n');
  console.log('Please execute this SQL manually:\n');
  console.log('━'.repeat(70));
  console.log('DROP POLICY IF EXISTS "Super admins can manage all roles" ON user_roles;');
  console.log('━'.repeat(70));
  console.log('\n📍 Steps:');
  console.log('1. Go to: https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Click "SQL Editor" in the left sidebar');
  console.log('4. Click "+ New query"');
  console.log('5. Paste the SQL above');
  console.log('6. Click "Run" or press Cmd+Enter / Ctrl+Enter\n');
}

dropPolicy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
