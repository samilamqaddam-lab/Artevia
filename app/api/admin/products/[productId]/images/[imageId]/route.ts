/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  updateProductImage,
  deleteProductImageComplete,
  setHeroImage
} from '@/lib/supabase/product-images';

/**
 * Check if user is admin
 */
async function isAdmin(supabase: any): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const adminEmails = ['admin@arteva.ma', 'sami@arteva.ma', 'samilamqaddam@gmail.com'];
  return adminEmails.includes(user.email || '');
}

/**
 * PUT /api/admin/products/[productId]/images/[imageId]
 * Update image details (alt text, attribution, etc.)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string; imageId: string } }
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

    const { productId, imageId } = params;
    const body = await request.json();

    // Handle setting as hero image
    if (body.setAsHero === true) {
      const result = await setHeroImage(productId, imageId);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }
      return NextResponse.json({ success: true, action: 'hero_set' });
    }

    // Handle other updates
    const { alt_text, attribution, metadata } = body;
    const updates: any = {};

    if (alt_text !== undefined) updates.alt_text = alt_text;
    if (attribution !== undefined) updates.attribution = attribution;
    if (metadata !== undefined) updates.metadata = metadata;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 }
      );
    }

    const result = await updateProductImage(imageId, updates);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating product image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products/[productId]/images/[imageId]
 * Delete a single image
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string; imageId: string } }
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

    const { imageId } = params;
    const result = await deleteProductImageComplete(imageId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting product image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}