/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { reorderProductImages } from '@/lib/supabase/product-images';

/**
 * Check if user is admin
 * TEMPORARY: Using email list until RLS policy is fixed
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

  console.log('[isAdmin] Checking user:', user.id, user.email);

  // TEMPORARY FIX: Use email list to bypass RLS recursion issue
  // TODO: Remove this after fixing the RLS policy with:
  // DROP POLICY IF EXISTS "Super admins can manage all roles" ON user_roles;
  const adminEmails = [
    'sami.lamqaddam@gmail.com',
    'sami.lamqaddam.sl@gmail.com',
    'sami.artipel@gmail.com',
    'ahmed.agh21@gmail.com'
  ];

  const isAdmin = adminEmails.includes(user.email || '');
  console.log('[isAdmin] Is admin:', isAdmin);

  return isAdmin;
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