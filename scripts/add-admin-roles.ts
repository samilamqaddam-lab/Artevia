#!/usr/bin/env node

// @ts-nocheck
/**
 * Add Admin Roles Script
 * This script adds admin roles to the user_roles table for existing users
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

async function addAdminRoles() {
  console.log('🚀 Adding admin roles to users...\n');

  const usersToAdd = [
    { id: '9cbccf4e-aa2b-4d6e-bd5e-5260b59f9957', email: 'sami.lamqaddam@gmail.com' },
    { id: '98cb39fa-b68b-4747-a73c-d4aba3c6774b', email: 'sami.lamqaddam.sl@gmail.com' }
  ];

  for (const user of usersToAdd) {
    console.log(`Adding admin role for ${user.email}...`);

    const { error } = await supabase
      .from('user_roles')
      .upsert(
        {
          user_id: user.id,
          role: 'admin'
        },
        {
          onConflict: 'user_id'
        }
      );

    if (error) {
      console.error(`  ❌ Error adding role for ${user.email}:`, error.message);
    } else {
      console.log(`  ✅ Successfully added admin role for ${user.email}`);
    }
  }

  console.log('\n✨ Admin roles added successfully!');
}

// Run the script
addAdminRoles()
  .then(() => {
    console.log('\n✅ Script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
