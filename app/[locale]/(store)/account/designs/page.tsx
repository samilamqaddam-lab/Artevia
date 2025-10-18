import {getTranslations, setRequestLocale} from 'next-intl/server';
import {locales, type Locale} from '@/i18n/settings';
import {UserDesigns} from '@/components/account/UserDesigns';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function AccountDesignsPage({params}: {params: {locale: string}}) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'account.designs'});

  return (
    <UserDesigns
      locale={locale}
      title={t('title')}
      emptyState={t('empty')}
      loadLabel={t('load')}
      deleteLabel={t('delete')}
      duplicateLabel={t('duplicate')}
      migrationPrompt={t('migrationPrompt')}
      migrateButton={t('migrateButton')}
    />
  );
}
