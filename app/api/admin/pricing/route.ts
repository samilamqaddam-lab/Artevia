import {NextResponse} from 'next/server';
import {revalidatePath} from 'next/cache';
import {getSupabaseClient, getSupabaseServiceClient} from '@/lib/supabase/server';
import {requireAdmin} from '@/lib/auth/roles';
import {logger} from '@/lib/logger';
import {products} from '@/lib/products';
import type {PriceOverrideInput, PriceTier} from '@/types/price-overrides';

/**
 * GET /api/admin/pricing
 * Returns all products with their pricing information, including any overrides
 */
export async function GET() {
  try {
    const supabase = getSupabaseClient();

    // Check authentication
    const {
      data: {user},
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({error: 'Non autorisé'}, {status: 401});
    }

    // Check admin role
    try {
      await requireAdmin();
    } catch (error) {
      return NextResponse.json({error: 'Accès refusé - Rôle administrateur requis'}, {status: 403});
    }

    // Use service client for DB operations (bypasses strict typing)
    const serviceClient = getSupabaseServiceClient();

    // Fetch all price overrides
    const {data: overrides, error: fetchError} = await serviceClient
      .from('price_overrides')
      .select('*')
      .order('product_id', {ascending: true});

    if (fetchError) {
      logger.error('Error fetching price overrides:', fetchError);
      return NextResponse.json(
        {error: 'Erreur lors de la récupération des prix'},
        {status: 500}
      );
    }

    // Build combined pricing data
    const pricingData = products.flatMap((product) =>
      product.methods.map((method) => {
        const override = (overrides || []).find(
          (o) => o.product_id === product.id && o.method_id === method.id
        );

        // Get either override or default pricing
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const overrideData = override as any;
        const tiers = overrideData?.price_tiers?.tiers
          ? overrideData.price_tiers.tiers.map((tier: PriceTier) => ({
              minQuantity: tier.quantity,
              unitPrice: tier.price
            }))
          : method.priceTiers.map((tier) => ({
              minQuantity: tier.minQuantity,
              unitPrice: tier.unitPrice
            }));

        return {
          product_id: product.id,
          product_name: product.nameKey,
          product_slug: product.slug,
          method_id: method.id,
          method_name: method.nameKey,
          has_override: !!override,
          override_id: override?.id || null,
          tiers,
          updated_at: override?.updated_at || null,
          updated_by: override?.updated_by || null
        };
      })
    );

    return NextResponse.json({pricing: pricingData});
  } catch (error) {
    logger.error('GET /api/admin/pricing error:', error);
    return NextResponse.json({error: 'Erreur serveur'}, {status: 500});
  }
}

/**
 * PUT /api/admin/pricing
 * Create or update a price override
 */
export async function PUT(request: Request) {
  try {
    const supabase = getSupabaseClient();

    // Check authentication
    const {
      data: {user},
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({error: 'Non autorisé'}, {status: 401});
    }

    // Check admin role
    try {
      await requireAdmin();
    } catch (error) {
      return NextResponse.json({error: 'Accès refusé - Rôle administrateur requis'}, {status: 403});
    }

    const body: PriceOverrideInput = await request.json();

    // Validate input
    if (!body.product_id || !body.method_id || !body.price_tiers) {
      return NextResponse.json(
        {error: 'Données manquantes (product_id, method_id, price_tiers requis)'},
        {status: 400}
      );
    }

    if (!body.price_tiers.tiers || !Array.isArray(body.price_tiers.tiers)) {
      return NextResponse.json(
        {error: 'price_tiers.tiers doit être un tableau'},
        {status: 400}
      );
    }

    if (body.price_tiers.tiers.length < 1) {
      return NextResponse.json(
        {error: 'Au moins un palier de prix est requis'},
        {status: 400}
      );
    }

    // Validate each tier
    for (const tier of body.price_tiers.tiers) {
      if (!tier.quantity || !tier.price) {
        return NextResponse.json(
          {error: 'Chaque palier doit avoir quantity et price'},
          {status: 400}
        );
      }
      if (tier.quantity <= 0 || tier.price <= 0) {
        return NextResponse.json(
          {error: 'Les quantités et prix doivent être positifs'},
          {status: 400}
        );
      }
    }

    // Validate tier quantities are in ascending order
    const quantities = body.price_tiers.tiers.map((t) => t.quantity);
    for (let i = 1; i < quantities.length; i++) {
      if (quantities[i] <= quantities[i - 1]) {
        return NextResponse.json(
          {error: 'Les quantités doivent être en ordre croissant'},
          {status: 400}
        );
      }
    }

    // Use service client for DB operations
    const serviceClient = getSupabaseServiceClient();

    // Upsert price override
    const upsertData = {
      product_id: body.product_id,
      method_id: body.method_id,
      price_tiers: body.price_tiers,
      updated_by: user.id
    };

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const {data, error: upsertError} = await (serviceClient
      .from('price_overrides')
      .upsert(upsertData as any, {
        onConflict: 'product_id,method_id'
      })
      .select()
      .single() as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */

    if (upsertError) {
      logger.error('Error upserting price override:', upsertError);
      return NextResponse.json(
        {error: 'Erreur lors de la sauvegarde des prix'},
        {status: 500}
      );
    }

    // Invalidate Next.js cache for affected pages
    try {
      // Find the product to get its slug
      const product = products.find((p) => p.id === body.product_id);
      if (product) {
        // Revalidate product pages for both locales
        revalidatePath(`/fr/product/${product.slug}`, 'page');
        revalidatePath(`/ar/product/${product.slug}`, 'page');
        logger.info(`Revalidated product pages for ${product.slug}`);
      }

      // Revalidate catalog pages for both locales
      revalidatePath('/fr/catalog', 'page');
      revalidatePath('/ar/catalog', 'page');
      logger.info('Revalidated catalog pages');

      // Revalidate admin pricing page
      revalidatePath('/fr/admin/pricing', 'page');
      revalidatePath('/ar/admin/pricing', 'page');
    } catch (revalidateError) {
      // Log but don't fail the request if revalidation fails
      logger.error('Error revalidating paths:', revalidateError);
    }

    return NextResponse.json({success: true, override: data});
  } catch (error) {
    logger.error('PUT /api/admin/pricing error:', error);
    return NextResponse.json({error: 'Erreur serveur'}, {status: 500});
  }
}

/**
 * DELETE /api/admin/pricing
 * Remove a price override (revert to default pricing)
 */
export async function DELETE(request: Request) {
  try {
    const supabase = getSupabaseClient();

    // Check authentication
    const {
      data: {user},
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({error: 'Non autorisé'}, {status: 401});
    }

    // Check admin role
    try {
      await requireAdmin();
    } catch (error) {
      return NextResponse.json({error: 'Accès refusé - Rôle administrateur requis'}, {status: 403});
    }

    const {searchParams} = new URL(request.url);
    const overrideId = searchParams.get('id');

    if (!overrideId) {
      return NextResponse.json({error: 'ID manquant'}, {status: 400});
    }

    // Use service client for DB operations
    const serviceClient = getSupabaseServiceClient();

    // Fetch the override first to get product info for revalidation
    const {data: override} = await serviceClient
      .from('price_overrides')
      .select('product_id')
      .eq('id', overrideId)
      .single();

    const {error: deleteError} = await serviceClient
      .from('price_overrides')
      .delete()
      .eq('id', overrideId);

    if (deleteError) {
      logger.error('Error deleting price override:', deleteError);
      return NextResponse.json(
        {error: 'Erreur lors de la suppression'},
        {status: 500}
      );
    }

    // Invalidate Next.js cache for affected pages
    if (override?.product_id) {
      try {
        // Find the product to get its slug
        const product = products.find((p) => p.id === override.product_id);
        if (product) {
          // Revalidate product pages for both locales
          revalidatePath(`/fr/product/${product.slug}`, 'page');
          revalidatePath(`/ar/product/${product.slug}`, 'page');
          logger.info(`Revalidated product pages for ${product.slug} after reset`);
        }

        // Revalidate catalog pages for both locales
        revalidatePath('/fr/catalog', 'page');
        revalidatePath('/ar/catalog', 'page');
        logger.info('Revalidated catalog pages after reset');

        // Revalidate admin pricing page
        revalidatePath('/fr/admin/pricing', 'page');
        revalidatePath('/ar/admin/pricing', 'page');
      } catch (revalidateError) {
        // Log but don't fail the request if revalidation fails
        logger.error('Error revalidating paths after reset:', revalidateError);
      }
    }

    return NextResponse.json({success: true});
  } catch (error) {
    logger.error('DELETE /api/admin/pricing error:', error);
    return NextResponse.json({error: 'Erreur serveur'}, {status: 500});
  }
}
