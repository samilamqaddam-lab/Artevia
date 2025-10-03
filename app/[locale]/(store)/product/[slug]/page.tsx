import {notFound} from 'next/navigation';
import {getTranslations, unstable_setRequestLocale} from 'next-intl/server';
import {ProductExperience} from '@/components/product/ProductExperience';
import {locales, type Locale} from '@/i18n/settings';
import {getProductBySlug, products} from '@/lib/products';

export function generateStaticParams() {
  return locales.flatMap((locale) => products.map((product) => ({locale, slug: product.slug})));
}

function stripNamespace(key: string) {
  return key.split('.').slice(1).join('.');
}

export default async function ProductPage({
  params
}: {
  params: {locale: string; slug: string};
}) {
  const locale = params.locale as Locale;
  unstable_setRequestLocale(locale);

  const product = getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const tProducts = await getTranslations({locale, namespace: 'products'});
  const tProduct = await getTranslations({locale, namespace: 'product'});
  const tLeadTimes = await getTranslations({locale, namespace: 'leadTimes'});

  const name = tProducts(stripNamespace(product.nameKey));
  const description = tProducts(stripNamespace(product.descriptionKey));

  const methods = product.methods.map((method) => ({
    ...method,
    label: tProducts(stripNamespace(method.nameKey)),
    description: tProducts(stripNamespace(method.descriptionKey))
  }));

  const zones = product.imprintZones.map((zone) => ({
    ...zone,
    label: tProducts(stripNamespace(zone.nameKey)),
    description: tProducts(stripNamespace(zone.descriptionKey))
  }));

  const colors = product.colorways.map((color) => ({
    ...color,
    label: tProducts(stripNamespace(color.labelKey))
  }));

  const leadTimes = product.leadTimes.map((lead) => ({
    ...lead,
    label: tLeadTimes(stripNamespace(lead.labelKey))
  }));

  const copy = {
    specs: tProduct('specs'),
    moq: tProduct('moq'),
    quantity: tProduct('quantity'),
    method: tProduct('method'),
    zone: tProduct('zone'),
    colorCount: tProduct('colorCount'),
    colorway: tProduct('colorway'),
    leadTime: tProduct('leadTime'),
    leadTimeHint: tProduct('leadTimeHint'),
    priceGrid: {
      title: tProduct('priceGrid.title'),
      unit: tProduct('priceGrid.unit'),
      total: tProduct('priceGrid.total')
    },
    summary: {
      title: tProduct('summary.title'),
      setupFee: tProduct('summary.setupFee'),
      surcharge: tProduct('summary.surcharge'),
      perUnit: tProduct('summary.perUnit'),
      total: tProduct('summary.total')
    },
    editor: {
      title: tProduct('editor.title'),
      description: tProduct('editor.description'),
      mode: {
        logo: tProduct('editor.mode.logo'),
        creative: tProduct('editor.mode.creative')
      },
      logoGuidelines: tProduct('editor.logoGuidelines'),
      colorLimit: tProduct('editor.colorLimit'),
      actions: {
        addToQuote: tProduct('editor.actions.addToQuote'),
        generateBat: tProduct('editor.actions.generateBat')
      },
      captures: {
        success: tProduct('editor.captures.success'),
        error: tProduct('editor.captures.error')
      }
    },
    rfq: {
      added: tProduct('rfq.added'),
      submitted: tProduct('rfq.submitted')
    }
  };

  return (
    <ProductExperience
      locale={locale}
      product={product}
      name={name}
      description={description}
      methods={methods}
      zones={zones}
      colors={colors}
      leadTimes={leadTimes}
      copy={copy}
    />
  );
}
