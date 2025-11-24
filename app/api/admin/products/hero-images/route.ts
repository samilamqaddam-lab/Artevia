import { NextResponse } from 'next/server';
import { getAllProductHeroImages } from '@/lib/supabase/product-images';

/**
 * GET /api/admin/products/hero-images
 * Get all product hero images
 */
export async function GET() {
  try {
    const heroImagesMap = await getAllProductHeroImages();

    // Convert Map to object for JSON serialization
    const heroImages: Record<string, string> = {};
    heroImagesMap.forEach((value, key) => {
      heroImages[key] = value;
    });

    return NextResponse.json({ heroImages });
  } catch (error) {
    console.error('Error fetching hero images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero images' },
      { status: 500 }
    );
  }
}