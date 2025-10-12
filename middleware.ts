import {createServerClient} from '@supabase/ssr';
import createMiddleware from 'next-intl/middleware';
import {type NextRequest, NextResponse} from 'next/server';
import {defaultLocale, locales} from './src/i18n/settings';

const handleI18nRouting = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export async function middleware(request: NextRequest) {
  let response = handleI18nRouting(request);

  // If handleI18nRouting returns nothing, create a new response
  if (!response) {
    response = NextResponse.next({
      request
    });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({name, value, options}) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request
          });
          cookiesToSet.forEach(({name, value, options}) =>
            response.cookies.set(name, value, options)
          );
        }
      }
    }
  );

  // Refresh session if expired
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\..*).*)'
  ]
};
