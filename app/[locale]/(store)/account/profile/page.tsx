import {getTranslations, setRequestLocale} from 'next-intl/server';
import {locales, type Locale} from '@/i18n/settings';
import {ProfileForm} from '@/components/account/ProfileForm';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function AccountProfilePage({params}: {params: {locale: string}}) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'account.profile'});

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">{t('title')}</h2>
      <ProfileForm locale={locale} />
    </div>
  );
}
