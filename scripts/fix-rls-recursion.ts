#!/usr/bin/env node

// @ts-nocheck
/**
 * Fix RLS Recursion
 * Drops the recursive policy that causes infinite loop
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
    },
    db: {
      schema: 'public'
    }
  }
);

async function fixRlsRecursion() {
  console.log('🚀 Fixing RLS recursion in user_roles table...\n');

  try {
    // We need to use raw SQL execution
    // Since we're using service role, we can execute admin commands

    console.log('Dropping recursive policy...');

    // Use Supabase REST API to execute SQL
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({
          query: 'DROP POLICY IF EXISTS "Super admins can manage all roles" ON user_roles;'
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Failed to drop policy:', error);

      // This is expected if exec_sql doesn't exist
      console.log('\n⚠️  Cannot execute raw SQL via API.');
      console.log('Please run this SQL manually in Supabase SQL Editor:');
      console.log('\n' + '='.repeat(60));
      console.log('DROP POLICY IF EXISTS "Super admins can manage all roles" ON user_roles;');
      console.log('='.repeat(60) + '\n');
      process.exit(1);
    }

    console.log('✅ Policy dropped successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
    console.log('\n⚠️  Please run this SQL manually in Supabase SQL Editor:');
    console.log('\n' + '='.repeat(60));
    console.log('DROP POLICY IF EXISTS "Super admins can manage all roles" ON user_roles;');
    console.log('='.repeat(60) + '\n');
    process.exit(1);
  }
}

// Run the script
fixRlsRecursion()
  .then(() => {
    console.log('\n✅ Fix completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
