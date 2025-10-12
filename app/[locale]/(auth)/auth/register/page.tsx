import {setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/settings';
import {locales} from '@/i18n/settings';
import {RegisterView} from '@/components/auth/RegisterView';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default function RegisterPage({params}: {params: {locale: string}}) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  return <RegisterView locale={locale} />;
}
