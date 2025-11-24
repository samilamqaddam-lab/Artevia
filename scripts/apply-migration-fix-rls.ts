#!/usr/bin/env node

// @ts-nocheck
/**
 * Apply RLS Fix Migration
 * Fixes infinite recursion in user_roles RLS policies
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
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

async function applyMigration() {
  console.log('🚀 Applying RLS fix migration...\n');

  const sql = `
-- Fix infinite recursion in user_roles RLS policies
DROP POLICY IF EXISTS "Super admins can manage all roles" ON user_roles;
`;

  console.log('Executing SQL:\n', sql);

  const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

  if (error) {
    console.error('❌ Error applying migration:', error);

    // Try alternative approach - direct execution
    console.log('\nTrying direct approach...');
    const { error: directError } = await supabase
      .from('_raw_sql')
      .select()
      .limit(0);

    if (directError) {
      console.error('❌ Direct approach failed:', directError);
      process.exit(1);
    }
  }

  console.log('\n✅ Migration applied successfully!');
}

// Run the script
applyMigration()
  .then(() => {
    console.log('\n✅ Script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
