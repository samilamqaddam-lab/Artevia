import {getTranslations, setRequestLocale} from 'next-intl/server';
import {locales, type Locale} from '@/i18n/settings';
import {products} from '@/lib/products';
import {getAllProductsWithPricing} from '@/lib/price-overrides';
import {CatalogView} from '@/components/product/CatalogView';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function CatalogPage({params}: {params: {locale: string}}) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const tCatalog = await getTranslations({locale, namespace: 'catalog'});
  const tLeadTimes = await getTranslations({locale, namespace: 'leadTimes'});
  const tProducts = await getTranslations({locale, namespace: 'products'});

  // Apply price overrides from database
  const productsWithPricing = await getAllProductsWithPricing(products);

  const catalogProducts = productsWithPricing.map((product) => ({
    ...product,
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
