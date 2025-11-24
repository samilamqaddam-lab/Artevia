#!/usr/bin/env node

// @ts-nocheck
/**
 * Fix Duplicate SQL Functions
 * Drops the UUID versions of functions that should use TEXT product_id
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

async function fixDuplicateFunctions() {
  console.log('🚀 Fixing duplicate function definitions...\n');

  console.log('⚠️  Cannot drop functions via API (requires SUPERUSER privileges).\n');
  console.log('Please execute this SQL manually:\n');
  console.log('━'.repeat(70));
  console.log(`
-- Drop the UUID versions of functions (we use TEXT product IDs)
DROP FUNCTION IF EXISTS set_hero_image(p_product_id uuid, p_image_id uuid);
DROP FUNCTION IF EXISTS reorder_product_images(p_product_id uuid, p_image_ids uuid[]);

-- Keep the TEXT versions which match our product ID format
-- (no action needed, they already exist)
  `.trim());
  console.log('━'.repeat(70));
  console.log('\n📍 Steps:');
  console.log('1. Go to: https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Click "SQL Editor" in the left sidebar');
  console.log('4. Click "+ New query"');
  console.log('5. Paste the SQL above');
  console.log('6. Click "Run" or press Cmd+Enter / Ctrl+Enter\n');
}

fixDuplicateFunctions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
