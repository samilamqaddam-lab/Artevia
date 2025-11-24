#!/usr/bin/env node

// @ts-nocheck
/**
 * Fix RLS Recursion via temporary SQL function
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

async function fixRls() {
  console.log('🚀 Fixing RLS recursion...\n');

  // Step 1: Create a temporary function to drop the policy
  console.log('Step 1: Creating temporary function...');

  const createFunctionSql = `
    CREATE OR REPLACE FUNCTION temp_drop_recursive_policy()
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      DROP POLICY IF EXISTS "Super admins can manage all roles" ON user_roles;
    END;
    $$;
  `;

  try {
    // We'll use a workaround - create the function via a migration
    const { error: createError } = await supabase.rpc('temp_drop_recursive_policy');

    if (createError && createError.code !== 'PGRST202') {
      console.log('Function doesn\'t exist yet, will try alternative...');
    }
  } catch (e) {
    // Expected
  }

  console.log('\n⚠️  Automated fix not available.');
  console.log('📝 Please execute this SQL in Supabase SQL Editor:\n');
  console.log('='.repeat(70));
  console.log('DROP POLICY IF EXISTS "Super admins can manage all roles" ON user_roles;');
  console.log('='.repeat(70));
  console.log('\n📍 Link: https://supabase.com/dashboard/project/_/sql/new\n');
}

fixRls()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
