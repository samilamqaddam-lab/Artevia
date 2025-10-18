import {redirect} from 'next/navigation';
import {locales, type Locale} from '@/i18n/settings';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function DesignsPage({params}: {params: {locale: string}}) {
  const locale = params.locale as Locale;
  // Redirect to account/designs page
  redirect(`/${locale}/account/designs`);
}
