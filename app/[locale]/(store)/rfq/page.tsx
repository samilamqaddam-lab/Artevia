import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {QuoteBasketView} from '@/components/product/QuoteBasketView';
import {locales, type Locale} from '@/i18n/settings';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: {locale: string}}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const isAr = locale === 'ar';

  return {
    title: isAr ? 'طلب عرض أسعار | أرتيفا' : 'Demande de Devis | Arteva',
    description: isAr
      ? 'أضف المنتجات الدعائية المخصصة إلى سلتك واحصل على عرض أسعار مجاني. توصيل في جميع أنحاء المغرب.'
      : 'Ajoutez vos objets publicitaires personnalisés au panier et recevez un devis gratuit sous 24h. Livraison partout au Maroc.',
    alternates: {
      canonical: `https://arteva.ma/${locale}/rfq`,
      languages: {
        'fr-MA': 'https://arteva.ma/fr/rfq',
        'ar-MA': 'https://arteva.ma/ar/rfq',
      },
    },
  };
}

export default function RfqPage({params}: {params: {locale: string}}) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  return <QuoteBasketView locale={locale} />;
}
