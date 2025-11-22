/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { reorderProductImages } from '@/lib/supabase/product-images';

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
 * PUT /api/admin/products/[productId]/images/reorder
 * Reorder product images
 */
export async function PUT(
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

    const { productId } = params;
    const body = await request.json();
    const { imageIds } = body;

    if (!imageIds || !Array.isArray(imageIds)) {
      return NextResponse.json(
        { error: 'Image IDs array is required' },
        { status: 400 }
      );
    }

    const result = await reorderProductImages(productId, imageIds);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error reordering product images:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}