import {NextResponse} from 'next/server';
import {getSupabaseClient, getSupabaseServiceClient} from '@/lib/supabase/server';
import {requireAdmin} from '@/lib/auth/roles';
import {logger} from '@/lib/logger';
import {products} from '@/lib/products';
import type {PriceOverrideInput} from '@/types/price-overrides';

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
        const tiers = override
          ? [
              {
                minQuantity: override.tier_1_quantity,
                unitPrice: Number(override.tier_1_price)
              },
              {
                minQuantity: override.tier_2_quantity,
                unitPrice: Number(override.tier_2_price)
              },
              {
                minQuantity: override.tier_3_quantity,
                unitPrice: Number(override.tier_3_price)
              }
            ]
          : method.priceTiers.slice(0, 3); // Only show first 3 tiers

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
    if (
      !body.product_id ||
      !body.method_id ||
      !body.tier_1_quantity ||
      !body.tier_1_price ||
      !body.tier_2_quantity ||
      !body.tier_2_price ||
      !body.tier_3_quantity ||
      !body.tier_3_price
    ) {
      return NextResponse.json(
        {error: 'Données manquantes ou invalides'},
        {status: 400}
      );
    }

    // Validate tier logic
    if (
      body.tier_1_quantity >= body.tier_2_quantity ||
      body.tier_2_quantity >= body.tier_3_quantity
    ) {
      return NextResponse.json(
        {error: 'Les quantités doivent être croissantes (palier 1 < palier 2 < palier 3)'},
        {status: 400}
      );
    }

    // Note: We don't enforce descending prices because volume discounts aren't always linear
    // The business might want to increase prices at higher volumes in some cases

    // Use service client for DB operations
    const serviceClient = getSupabaseServiceClient();

    // Upsert price override
    const upsertData = {
      product_id: body.product_id,
      method_id: body.method_id,
      tier_1_quantity: body.tier_1_quantity,
      tier_1_price: body.tier_1_price,
      tier_2_quantity: body.tier_2_quantity,
      tier_2_price: body.tier_2_price,
      tier_3_quantity: body.tier_3_quantity,
      tier_3_price: body.tier_3_price,
      updated_by: user.id
    };

    const {data, error: upsertError} = await serviceClient
      .from('price_overrides')
      .upsert(upsertData, {
        onConflict: 'product_id,method_id'
      })
      .select()
      .single();

    if (upsertError) {
      logger.error('Error upserting price override:', upsertError);
      return NextResponse.json(
        {error: 'Erreur lors de la sauvegarde des prix'},
        {status: 500}
      );
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

    return NextResponse.json({success: true});
  } catch (error) {
    logger.error('DELETE /api/admin/pricing error:', error);
    return NextResponse.json({error: 'Erreur serveur'}, {status: 500});
  }
}
