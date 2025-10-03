import createMiddleware from 'next-intl/middleware';
import {defaultLocale, locales} from './src/i18n/settings';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\..*).*)'
  ]
};
