import {getTranslations, setRequestLocale} from 'next-intl/server';
import {locales, type Locale} from '@/i18n/settings';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function AccountOrdersPage({params}: {params: {locale: string}}) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'account.orders'});

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">{t('title')}</h2>
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500 dark:border-white/20 dark:bg-[#161616] dark:text-slate-400">
        {t('empty')}
      </div>
    </div>
  );
}
