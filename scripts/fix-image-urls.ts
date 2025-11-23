#!/usr/bin/env node

// @ts-nocheck
/**
 * Fix Image URLs Script
 * Removes localhost:3000 from image URLs to make them relative paths
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

async function fixImageUrls() {
  console.log('🔧 Fixing image URLs...\n');

  try {
    // Get all images with localhost URLs
    const { data: images, error: fetchError } = await supabase
      .from('product_images')
      .select('id, product_id, image_url')
      .like('image_url', '%localhost:3000%');

    if (fetchError) {
      console.error('❌ Error fetching images:', fetchError);
      return;
    }

    if (!images || images.length === 0) {
      console.log('✅ No images need fixing!');
      return;
    }

    console.log(`Found ${images.length} images to fix\n`);

    let fixed = 0;
    let errors = 0;

    for (const image of images) {
      const newUrl = image.image_url.replace('http://localhost:3000', '');

      const { error: updateError } = await supabase
        .from('product_images')
        .update({ image_url: newUrl })
        .eq('id', image.id);

      if (updateError) {
        console.error(`❌ Error updating ${image.id}:`, updateError.message);
        errors++;
      } else {
        console.log(`✅ Fixed: ${image.product_id}`);
        console.log(`   ${image.image_url}`);
        console.log(`   → ${newUrl}\n`);
        fixed++;
      }
    }

    console.log('='.repeat(60));
    console.log('📊 Fix Summary:');
    console.log(`  ✅ Successfully fixed: ${fixed} images`);
    console.log(`  ❌ Errors: ${errors}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the fix
fixImageUrls()
  .then(() => {
    console.log('\n✨ Fix completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fix failed:', error);
    process.exit(1);
  });
