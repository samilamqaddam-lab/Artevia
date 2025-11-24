/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Product Images Management
 * Handles all operations related to product images in Supabase
 */

import { createServerSupabaseClient, getSupabaseServiceClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '@/lib/supabase/types';

export type ProductImage = Database['public']['Tables']['product_images']['Row'];

/**
 * Upload an image file to Supabase Storage
 */
export async function uploadProductImage(
  file: File,
  productId: string
): Promise<{ url: string; path: string } | { error: string }> {
  const supabase = createServerSupabaseClient();

  // Validate file
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { error: 'File size exceeds 10MB limit' };
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { error: 'Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.' };
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${productId}/${uuidv4()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  // Upload to Storage
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload error:', error);
    return { error: error.message };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return {
    url: publicUrl,
    path: filePath
  };
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteProductImage(storagePath: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.storage
    .from('product-images')
    .remove([storagePath]);

  if (error) {
    console.error('Delete error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Get all images for a product
 */
export async function getProductImages(productId: string): Promise<ProductImage[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('is_hero', { ascending: false })
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching product images:', error);
    return [];
  }

  return data || [];
}

/**
 * Get the hero image for a product (PUBLIC - no auth required)
 */
export async function getProductHeroImage(productId: string): Promise<string | undefined> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('product_images')
    .select('image_url')
    .eq('product_id', productId)
    .eq('is_hero', true)
    .single();

  if (error || !data) {
    // If no hero image found, try to get the first image
    const { data: firstImage } = await supabase
      .from('product_images')
      .select('image_url')
      .eq('product_id', productId)
      .order('display_order', { ascending: true })
      .limit(1)
      .single();

    return firstImage?.image_url;
  }

  return data.image_url;
}

/**
 * Get all product images for gallery (PUBLIC - no auth required)
 */
export async function getProductGallery(productId: string): Promise<string[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('product_images')
    .select('image_url')
    .eq('product_id', productId)
    .order('is_hero', { ascending: false })
    .order('display_order', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map(img => img.image_url);
}

/**
 * Get all hero images for multiple products at once (PUBLIC - no auth required)
 * Returns a map of productId -> heroImageUrl
 */
export async function getAllProductHeroImages(): Promise<Map<string, string>> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('product_images')
    .select('product_id, image_url')
    .eq('is_hero', true);

  const imageMap = new Map<string, string>();

  if (error || !data) {
    return imageMap;
  }

  // Create map of product_id to hero image URL
  data.forEach(item => {
    imageMap.set(item.product_id, item.image_url);
  });

  return imageMap;
}

/**
 * Add image record to database
 */
export async function addProductImageRecord(
  productId: string,
  imageUrl: string,
  imageType: 'local' | 'external' | 'uploaded',
  storagePath?: string,
  altText?: string,
  attribution?: any
): Promise<{ data?: ProductImage; error?: string }> {
  // Use service client to bypass RLS
  let supabase;
  try {
    supabase = getSupabaseServiceClient();
  } catch (error) {
    // Fallback to regular client if service client not available
    console.log('Service client not available, using regular client');
    supabase = createServerSupabaseClient();
  }

  // Get current max display order
  const { data: existingImages } = await supabase
    .from('product_images')
    .select('display_order')
    .eq('product_id', productId)
    .order('display_order', { ascending: false })
    .limit(1);

  const nextOrder = existingImages && existingImages.length > 0
    ? (existingImages[0].display_order || 0) + 1
    : 1;

  // Check if this is the first image (make it hero)
  const { count } = await supabase
    .from('product_images')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', productId);

  const isFirstImage = count === 0;

  // Insert image record
  const { data, error } = await supabase
    .from('product_images')
    .insert({
      product_id: productId,
      image_url: imageUrl,
      image_type: imageType,
      storage_path: storagePath,
      is_hero: isFirstImage,
      display_order: nextOrder,
      alt_text: altText,
      attribution: attribution
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding image record:', error);
    return { error: error.message };
  }

  return { data };
}

/**
 * Update image record
 */
export async function updateProductImage(
  imageId: string,
  updates: Partial<ProductImage>
): Promise<{ success: boolean; error?: string }> {
  // Use service client to bypass RLS
  let supabase;
  try {
    supabase = getSupabaseServiceClient();
  } catch (error) {
    // Fallback to regular client if service client not available
    console.log('Service client not available, using regular client');
    supabase = createServerSupabaseClient();
  }

  const { error } = await supabase
    .from('product_images')
    .update(updates)
    .eq('id', imageId);

  if (error) {
    console.error('Error updating image:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Delete image record and file
 */
export async function deleteProductImageComplete(imageId: string): Promise<{ success: boolean; error?: string }> {
  // Use service client to bypass RLS
  let supabase;
  try {
    supabase = getSupabaseServiceClient();
  } catch (error) {
    // Fallback to regular client if service client not available
    console.log('Service client not available, using regular client');
    supabase = createServerSupabaseClient();
  }

  // First get the image to get storage path
  const { data: image } = await supabase
    .from('product_images')
    .select('storage_path, image_type')
    .eq('id', imageId)
    .single();

  if (!image) {
    return { success: false, error: 'Image not found' };
  }

  // Delete from storage if it's an uploaded image
  if (image.image_type === 'uploaded' && image.storage_path) {
    const deleteResult = await deleteProductImage(image.storage_path);
    if (!deleteResult.success) {
      return deleteResult;
    }
  }

  // Delete database record
  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId);

  if (error) {
    console.error('Error deleting image record:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Set an image as hero
 */
export async function setHeroImage(productId: string, imageId: string): Promise<{ success: boolean; error?: string }> {
  // Use service client to bypass RLS
  let supabase;
  try {
    supabase = getSupabaseServiceClient();
  } catch (error) {
    // Fallback to regular client if service client not available
    console.log('Service client not available, using regular client');
    supabase = createServerSupabaseClient();
  }

  try {
    // First, set all images to non-hero
    const { error: resetError } = await supabase
      .from('product_images')
      .update({ is_hero: false })
      .eq('product_id', productId);

    if (resetError) {
      console.error('Error resetting hero status:', resetError);
      return { success: false, error: resetError.message };
    }

    // Then set the selected image as hero
    const { error: updateError } = await supabase
      .from('product_images')
      .update({ is_hero: true })
      .eq('id', imageId)
      .eq('product_id', productId);

    if (updateError) {
      console.error('Error setting hero image:', updateError);
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error setting hero image:', error);
    return { success: false, error: 'Failed to set hero image' };
  }
}

/**
 * Reorder images
 */
export async function reorderProductImages(
  productId: string,
  imageIds: string[]
): Promise<{ success: boolean; error?: string }> {
  // Use service client to bypass RLS
  let supabase;
  try {
    supabase = getSupabaseServiceClient();
  } catch (error) {
    // Fallback to regular client if service client not available
    console.log('Service client not available, using regular client');
    supabase = createServerSupabaseClient();
  }

  try {
    // Update display_order for each image
    const updatePromises = imageIds.map((imageId, index) =>
      supabase
        .from('product_images')
        .update({ display_order: index })
        .eq('id', imageId)
        .eq('product_id', productId)
    );

    const results = await Promise.all(updatePromises);

    // Check if any updates failed
    const failedUpdate = results.find(result => result.error);
    if (failedUpdate?.error) {
      console.error('Error reordering images:', failedUpdate.error);
      return { success: false, error: failedUpdate.error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error reordering images:', error);
    return { success: false, error: 'Failed to reorder images' };
  }
}

/**
 * Import image from URL
 */
export async function importImageFromUrl(
  productId: string,
  imageUrl: string,
  altText?: string,
  attribution?: any
): Promise<{ data?: ProductImage; error?: string }> {
  // Validate URL
  try {
    new URL(imageUrl);
  } catch {
    return { error: 'Invalid URL' };
  }

  // Add as external image
  return addProductImageRecord(
    productId,
    imageUrl,
    'external',
    undefined,
    altText,
    attribution
  );
}

/**
 * Get image metadata (dimensions, size, etc.)
 */
export async function getImageMetadata(url: string): Promise<{
  width?: number;
  height?: number;
  size?: number;
  format?: string;
}> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = () => resolve({});
    img.src = url;
  });
}

/**
 * Process and optimize image before upload
 */
export async function processImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Draw and compress
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to process image'));
            }
          },
          file.type === 'image/png' ? 'image/png' : 'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}