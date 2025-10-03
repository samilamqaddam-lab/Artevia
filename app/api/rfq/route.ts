import {NextResponse} from 'next/server';
import {getSupabaseClient} from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = await request.json();
  const now = new Date();
  const orderId = `CMD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  let supabase;
  try {
    supabase = getSupabaseClient();
  } catch (error) {
    console.error('Supabase client initialisation failed', error);
    return NextResponse.json({message: 'Supabase is not configured.'}, {status: 500});
  }

  const payload = {
    items: body.items ?? [],
    notes: body.notes ?? '',
    checkout: body.checkout ?? null,
    totals: body.totals ?? null,
    discounts: body.discounts ?? [],
    locale: body.locale ?? null
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
    console.error('Supabase insert failed', insertError);
    return NextResponse.json({message: 'Erreur lors de la création de la commande.'}, {status: 500});
  }

  return NextResponse.json({
    orderId,
    status: 'pending-review',
    receivedAt: now.toISOString(),
    reviewEta: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
  });
}
