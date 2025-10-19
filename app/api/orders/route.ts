import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/client';
import {logger} from '@/lib/logger';
import {RFQSchema} from '@/types/api-validation';
import {z} from 'zod';

/**
 * GET /api/orders - Get all orders for authenticated user
 */
export async function GET() {
  try {
    const supabase = createClient();

    // Check authentication
    const {
      data: {user},
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({message: 'Non authentifié'}, {status: 401});
    }

    // Fetch orders for current user
    const {data: orders, error: fetchError} = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', {ascending: false});

    if (fetchError) {
      logger.error('Error fetching orders:', fetchError);
      return NextResponse.json({message: 'Erreur lors de la récupération des commandes'}, {status: 500});
    }

    return NextResponse.json({orders: orders || []});
  } catch (error) {
    logger.error('GET /api/orders error:', error);
    return NextResponse.json({message: 'Erreur serveur'}, {status: 500});
  }
}

/**
 * POST /api/orders - Create a new order
 */
export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // Check authentication
    const {
      data: {user},
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({message: 'Non authentifié'}, {status: 401});
    }

    const body = await request.json();

    // Validate request data
    const validatedData = RFQSchema.parse(body);

    // Generate order ID
    const now = new Date();
    const orderId = `CMD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const payload = {
      items: validatedData.items,
      notes: validatedData.notes ?? '',
      checkout: validatedData.checkout ?? null,
      totals: validatedData.totals ?? null,
      discounts: validatedData.discounts,
      locale: validatedData.locale ?? null
    };

    // Insert order with user_id
    const {data: order, error: insertError} = await supabase
      .from('orders')
      .insert({
        order_id: orderId,
        user_id: user.id, // Important: Associate order with user
        status: 'pending-review',
        received_at: now.toISOString(),
        locale: payload.locale,
        total_amount: payload.totals?.total ?? null,
        discount_amount: payload.totals?.discount ?? null,
        quantity_total: payload.totals?.quantity ?? null,
        checkout: payload.checkout,
        notes: payload.notes,
        items: payload.items,
        discounts: payload.discounts,
        raw_payload: payload
      })
      .select()
      .single();

    if (insertError) {
      logger.error('Supabase insert failed', insertError);
      return NextResponse.json({message: 'Erreur lors de la création de la commande'}, {status: 500});
    }

    return NextResponse.json({
      order,
      orderId,
      status: 'pending-review',
      receivedAt: now.toISOString(),
      reviewEta: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      logger.warn('Invalid order request data:', error.issues);
      return NextResponse.json(
        {
          message: 'Données invalides',
          errors: error.issues.map((err) => ({
            path: err.path.join('.'),
            message: err.message
          }))
        },
        {status: 400}
      );
    }

    // Handle unexpected errors
    logger.error('POST /api/orders error:', error);
    return NextResponse.json({message: 'Une erreur serveur s\'est produite'}, {status: 500});
  }
}
