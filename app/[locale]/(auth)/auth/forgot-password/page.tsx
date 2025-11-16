import {setRequestLocale} from 'next-intl/server';
import {locales, type Locale} from '@/i18n/settings';
import {ForgotPasswordView} from '@/components/auth/ForgotPasswordView';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function ForgotPasswordPage({
  params
}: {
  params: {locale: string};
}) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);

  return <ForgotPasswordView locale={locale} />;
}
