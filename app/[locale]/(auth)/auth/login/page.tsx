import {setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/settings';
import {locales} from '@/i18n/settings';
import {LoginView} from '@/components/auth/LoginView';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default function LoginPage({params}: {params: {locale: string}}) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  return <LoginView locale={locale} />;
}
