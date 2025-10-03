import {getTranslations, unstable_setRequestLocale} from 'next-intl/server';
import {DesignGallery} from '@/components/product/DesignGallery';
import {locales, type Locale} from '@/i18n/settings';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function DesignsPage({params}: {params: {locale: string}}) {
  const locale = params.locale as Locale;
  unstable_setRequestLocale(locale);
  const tDesigns = await getTranslations({locale, namespace: 'designs'});

  return (
    <DesignGallery
      locale={locale}
      title={tDesigns('title')}
      emptyState={tDesigns('empty')}
      loadLabel={tDesigns('load')}
      deleteLabel={tDesigns('delete')}
    />
  );
}
