import {getTranslations, setRequestLocale} from 'next-intl/server';
import {locales, type Locale} from '@/i18n/settings';
import {products} from '@/lib/products';
import {getAllProductsWithPricing} from '@/lib/price-overrides';
import {getAllProductHeroImages} from '@/lib/supabase/product-images';
import {CatalogView} from '@/components/product/CatalogView';
import type {Metadata} from 'next';

// Revalidate every 60 seconds - ensures price changes appear within 1 minute
// Combined with revalidatePath() in admin API for immediate updates
export const revalidate = 60;

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: {locale: string}}): Promise<Metadata> {
  const locale = params.locale;
  const isAr = locale === 'ar';
  return {
    title: isAr ? 'كتالوج المنتجات الدعائية المخصصة | أرتيفا' : 'Catalogue Objets Publicitaires Personnalisés | Arteva',
    description: isAr
      ? 'تصفح كتالوج المنتجات الدعائية المخصصة للشركات في المغرب. أكواب، أقلام، نسيج، إكسسوارات تقنية. تصميم عبر الإنترنت وتوصيل في جميع أنحاء المغرب.'
      : 'Parcourez notre catalogue d\'objets publicitaires personnalisés pour entreprises au Maroc. Mugs, stylos, textile, accessoires tech. Design en ligne et livraison partout au Maroc.',
    alternates: {
      canonical: `https://arteva.ma/${locale}/catalog`,
      languages: {
        'fr-MA': 'https://arteva.ma/fr/catalog',
        'ar-MA': 'https://arteva.ma/ar/catalog',
      }
    }
  };
}

export default async function CatalogPage({params}: {params: {locale: string}}) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const tCatalog = await getTranslations({locale, namespace: 'catalog'});
  const tLeadTimes = await getTranslations({locale, namespace: 'leadTimes'});
  const tProducts = await getTranslations({locale, namespace: 'products'});

  // Apply price overrides from database
  const productsWithPricing = await getAllProductsWithPricing(products);

  // Get all hero images from database
  const heroImagesMap = await getAllProductHeroImages();

  const catalogProducts = productsWithPricing.map((product) => ({
    ...product,
    // Use dynamic hero image from database if available, otherwise fallback to static
    heroImage: heroImagesMap.get(product.id) || product.heroImage,
    name: tProducts(product.nameKey.split('.').slice(1).join('.')),
    description: tProducts(product.descriptionKey.split('.').slice(1).join('.')),
    methodLabels: product.methods.map((method) =>
      tProducts(method.nameKey.split('.').slice(1).join('.'))
    ),
    leadTimeLabels: product.leadTimes.map((lead) => tLeadTimes(lead.labelKey.split('.').slice(1).join('.')))
  }));

  return (
    <CatalogView
      locale={locale}
      title={tCatalog('title')}
      description={tCatalog('description')}
      products={catalogProducts}
      ctaLabel={tCatalog('cta')}
      moqLabel={tCatalog('moqTag')}
    />
  );
}
