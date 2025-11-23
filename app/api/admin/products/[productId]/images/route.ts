/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  getProductImages,
  uploadProductImage,
  addProductImageRecord,
  importImageFromUrl,
  processImage
} from '@/lib/supabase/product-images';

/**
 * Check if user is admin
 */
async function isAdmin(supabase: any): Promise<boolean> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error('[isAdmin] Auth error:', authError);
    return false;
  }

  if (!user) {
    console.error('[isAdmin] No user found');
    return false;
  }

  console.log('[isAdmin] Checking role for user:', user.id, user.email);

  // Check user_roles table instead of hardcoded emails
  const { data: userRole, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('[isAdmin] Error fetching role:', error);
    return false;
  }

  if (!userRole) {
    console.error('[isAdmin] No role found for user');
    return false;
  }

  console.log('[isAdmin] User role:', userRole.role);
  return userRole.role === 'admin' || userRole.role === 'super_admin';
}

/**
 * GET /api/admin/products/[productId]/images
 * Get all images for a product
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = params.productId;
    const images = await getProductImages(productId);

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching product images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/products/[productId]/images
 * Upload new images or import from URL
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const supabase = createServerSupabaseClient();

    // Check admin permission
    if (!await isAdmin(supabase)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const productId = params.productId;
    const contentType = request.headers.get('content-type') || '';

    // Handle file upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const files = formData.getAll('images') as File[];
      const altTexts = formData.getAll('altTexts') as string[];

      if (!files || files.length === 0) {
        return NextResponse.json(
          { error: 'No files provided' },
          { status: 400 }
        );
      }

      const results = [];
      const errors = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const altText = altTexts[i] || '';

        try {
          // Process and optimize image
          const optimizedBlob = await processImage(file);
          const optimizedFile = new File([optimizedBlob], file.name, { type: file.type });

          // Upload to storage
          const uploadResult = await uploadProductImage(optimizedFile, productId);

          if ('error' in uploadResult) {
            errors.push({ file: file.name, error: uploadResult.error });
            continue;
          }

          // Add to database
          const dbResult = await addProductImageRecord(
            productId,
            uploadResult.url,
            'uploaded',
            uploadResult.path,
            altText
          );

          if (dbResult.error) {
            errors.push({ file: file.name, error: dbResult.error });
            // Try to delete uploaded file
            if (uploadResult.path) {
              const { deleteProductImage } = await import('@/lib/supabase/product-images');
              await deleteProductImage(uploadResult.path);
            }
            continue;
          }

          results.push(dbResult.data);
        } catch (error) {
          console.error('Error processing file:', error);
          errors.push({ file: file.name, error: 'Processing failed' });
        }
      }

      return NextResponse.json({
        success: results.length > 0,
        images: results,
        errors: errors.length > 0 ? errors : undefined
      });
    }

    // Handle URL import
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const { imageUrl, altText, attribution } = body;

      if (!imageUrl) {
        return NextResponse.json(
          { error: 'Image URL is required' },
          { status: 400 }
        );
      }

      const result = await importImageFromUrl(
        productId,
        imageUrl,
        altText,
        attribution
      );

      if (result.error) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        image: result.data
      });
    }

    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in POST /api/admin/products/[productId]/images:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products/[productId]/images
 * Batch delete images
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const supabase = createServerSupabaseClient();

    // Check admin permission
    if (!await isAdmin(supabase)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { imageIds } = body;

    if (!imageIds || !Array.isArray(imageIds)) {
      return NextResponse.json(
        { error: 'Image IDs array is required' },
        { status: 400 }
      );
    }

    const { deleteProductImageComplete } = await import('@/lib/supabase/product-images');
    const results = [];
    const errors = [];

    for (const imageId of imageIds) {
      const result = await deleteProductImageComplete(imageId);
      if (result.success) {
        results.push(imageId);
      } else {
        errors.push({ id: imageId, error: result.error });
      }
    }

    return NextResponse.json({
      success: results.length > 0,
      deleted: results,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error in DELETE /api/admin/products/[productId]/images:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}