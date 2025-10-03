import {unstable_setRequestLocale} from 'next-intl/server';
import {QuoteBasketView} from '@/components/product/QuoteBasketView';
import {locales, type Locale} from '@/i18n/settings';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default function RfqPage({params}: {params: {locale: string}}) {
  const locale = params.locale as Locale;
  unstable_setRequestLocale(locale);
  return <QuoteBasketView locale={locale} />;
}
