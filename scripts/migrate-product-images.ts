#!/usr/bin/env node

// @ts-nocheck
/**
 * Migration Script: Import existing product images into the new system
 * This script migrates images from product-image-overrides.json and products.ts
 * to the new Supabase product_images table
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { products } from '../src/lib/products.js';

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

// Load image overrides
const imageOverridesPath = resolve(process.cwd(), 'src/lib/product-image-overrides.json');
const imageOverrides = JSON.parse(readFileSync(imageOverridesPath, 'utf-8'));

async function migrateProductImages() {
  console.log('🚀 Starting product images migration...\n');

  // Use the products array directly
  let totalMigrated = 0;
  let totalErrors = 0;

  for (const product of products) {
    const productName = typeof product.name === 'string' ? product.name : (product.name?.fr || product.name?.ar || product.id);
    console.log(`\n📦 Processing: ${productName} (${product.id})`);

    // Check if product has custom image overrides
    const override = imageOverrides[product.id];
    const imagesToMigrate = override || product;

    if (!imagesToMigrate.heroImage && (!imagesToMigrate.gallery || imagesToMigrate.gallery.length === 0)) {
      console.log('  ⚠️  No images found for this product');
      continue;
    }

    // Prepare images array
    const images = [];

    // Add hero image
    if (imagesToMigrate.heroImage) {
      images.push({
        url: imagesToMigrate.heroImage,
        isHero: true,
        order: 0
      });
    }

    // Add gallery images
    if (imagesToMigrate.gallery && Array.isArray(imagesToMigrate.gallery)) {
      imagesToMigrate.gallery.forEach((url, index) => {
        // Skip if it's the same as hero image (avoid duplicates)
        if (url !== imagesToMigrate.heroImage) {
          images.push({
            url,
            isHero: false,
            order: index + 1
          });
        }
      });
    }

    // Get attributions if available
    const attributions = override?.attributions || imagesToMigrate.imageAttributions || [];

    // Migrate each image
    for (const image of images) {
      try {
        // Determine image type
        let imageType = 'external';
        const imageUrl = image.url;

        if (image.url.startsWith('/images/')) {
          imageType = 'local';
          // Keep as relative path - Next.js Image component handles it
        }

        // Find attribution for this image
        const imageAttribution = attributions.find((attr: any) =>
          image.url.includes(attr.link?.split('/').pop() || '')
        );

        // Check if image already exists
        const { data: existing } = await supabase
          .from('product_images')
          .select('id')
          .eq('product_id', product.id)
          .eq('image_url', image.url)
          .single();

        if (existing) {
          console.log(`  ⚠️  Image already exists: ${image.url.substring(0, 50)}...`);
          continue;
        }

        // Insert image record
        const { data, error } = await supabase
          .from('product_images')
          .insert({
            product_id: product.id,
            image_url: image.url,
            image_type: imageType,
            is_hero: image.isHero,
            display_order: image.order,
            alt_text: product.name,
            attribution: imageAttribution ? {
              title: imageAttribution.title,
              source: imageAttribution.source,
              link: imageAttribution.link
            } : null,
            metadata: {
              migrated: true,
              migrated_at: new Date().toISOString(),
              original_source: override ? 'overrides' : 'products'
            }
          })
          .select()
          .single();

        if (error) {
          console.error(`  ❌ Error migrating image:`, error.message);
          totalErrors++;
        } else {
          console.log(`  ✅ Migrated: ${image.isHero ? '⭐ Hero' : '📷 Gallery'} image`);
          totalMigrated++;
        }
      } catch (error) {
        console.error(`  ❌ Unexpected error:`, error);
        totalErrors++;
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Migration Summary:');
  console.log(`  ✅ Successfully migrated: ${totalMigrated} images`);
  console.log(`  ❌ Errors encountered: ${totalErrors}`);
  console.log('='.repeat(60) + '\n');

  // Verify migration
  const { count } = await supabase
    .from('product_images')
    .select('*', { count: 'exact', head: true });

  console.log(`📈 Total images in database: ${count}`);
}

// Run migration
migrateProductImages()
  .then(() => {
    console.log('\n✨ Migration completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });