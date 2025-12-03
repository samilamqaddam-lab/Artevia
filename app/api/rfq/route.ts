import {NextResponse} from 'next/server';
import {getSupabaseServiceClient} from '@/lib/supabase/server';
import {logger} from '@/lib/logger';
import {RFQSchema} from '@/types/api-validation';
import {z} from 'zod';
import {
  sendCustomerOrderConfirmation,
  sendAdminOrderNotification,
  getProductDisplayName
} from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request data
    const validatedData = RFQSchema.parse(body);

    const now = new Date();
    const orderId = `CMD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    // Use service client for DB operations (no auth required for quote requests)
    let supabase;
    try {
      supabase = getSupabaseServiceClient();
    } catch (error) {
      logger.error('Supabase client initialisation failed', error);
      return NextResponse.json({message: 'Supabase is not configured.'}, {status: 500});
    }

    const payload = {
      items: validatedData.items,
      notes: validatedData.notes ?? '',
      checkout: validatedData.checkout ?? null,
      totals: validatedData.totals ?? null,
      discounts: validatedData.discounts,
      locale: validatedData.locale ?? null
    };

  const {error: insertError} = await supabase
    .from('orders')
    .insert({
      order_id: orderId,
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
    });

  if (insertError) {
    logger.error('Supabase insert failed', insertError);
    return NextResponse.json({message: 'Erreur lors de la création de la commande.'}, {status: 500});
  }

    // Send confirmation emails (truly non-blocking - fire and forget)
    if (payload.checkout?.email) {
      // Prepare email data
      const emailItems = payload.items.map((item) => ({
        productName: getProductDisplayName(item.productId),
        quantity: item.quantity,
        price: item.price
      }));

      const emailData = {
        orderId,
        customerName: payload.checkout.contact,
        customerEmail: payload.checkout.email,
        customerPhone: payload.checkout.phone,
        company: payload.checkout.company,
        items: emailItems,
        totalAmount: payload.totals?.total ?? 0,
        discountAmount: payload.totals?.discount ?? 0,
        quantity: payload.totals?.quantity ?? 0,
        notes: payload.notes || undefined,
        locale: (payload.locale || 'fr') as 'fr' | 'ar',
        receivedAt: now.toISOString(),
        reviewEta: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
      };

      // Fire and forget - don't await, just log results
      sendCustomerOrderConfirmation(emailData)
        .then((result) => {
          if (result.success) {
            logger.info(`Customer confirmation email sent for order ${orderId}`);
          } else {
            logger.error('Failed to send customer confirmation email', result.error);
          }
        })
        .catch((err) => logger.error('Error sending customer email', err));

      sendAdminOrderNotification(emailData)
        .then((result) => {
          if (result.success) {
            logger.info(`Admin notification email sent for order ${orderId}`);
          } else {
            logger.error('Failed to send admin notification email', result.error);
          }
        })
        .catch((err) => logger.error('Error sending admin email', err));
    }

    return NextResponse.json({
      orderId,
      status: 'pending-review',
      receivedAt: now.toISOString(),
      reviewEta: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      logger.warn('Invalid RFQ request data:', error.issues);
      return NextResponse.json(
        {
          message: 'Données invalides',
          errors: error.issues.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        },
        {status: 400}
      );
    }

    // Handle unexpected errors
    logger.error('RFQ API error:', error);
    return NextResponse.json(
      {message: 'Une erreur serveur s\'est produite'},
      {status: 500}
    );
  }
}
