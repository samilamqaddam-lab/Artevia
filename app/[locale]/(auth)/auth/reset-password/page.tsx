import {setRequestLocale} from 'next-intl/server';
import {locales, type Locale} from '@/i18n/settings';
import {ResetPasswordView} from '@/components/auth/ResetPasswordView';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function ResetPasswordPage({
  params
}: {
  params: {locale: string};
}) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);

  return <ResetPasswordView locale={locale} />;
}
