import {createRouteHandlerClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import type {Database} from '@/lib/supabase/types';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const locale = requestUrl.searchParams.get('locale') ?? 'fr';

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({cookies: () => cookieStore});
    await supabase.auth.exchangeCodeForSession(code);
  }

  requestUrl.searchParams.delete('code');
  requestUrl.pathname = `/${locale}`;
  return NextResponse.redirect(requestUrl);
}
