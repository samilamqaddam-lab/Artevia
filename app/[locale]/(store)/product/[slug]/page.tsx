import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ProductExperience} from '@/components/product/ProductExperience';
import {locales, type Locale} from '@/i18n/settings';
import {getProductBySlug, products} from '@/lib/products';
import {getProductWithPricing} from '@/lib/price-overrides';
import type {Metadata} from 'next';

// Revalidate every 60 seconds - ensures price changes appear within 1 minute
// Combined with revalidatePath() in admin API for immediate updates
export const revalidate = 60;

export function generateStaticParams() {
  return locales.flatMap((locale) => products.map((product) => ({locale, slug: product.slug})));
}

// Helper function pour métadonnées SEO par produit
function getProductSEOMeta(
  slug: string,
  name: string,
  description: string
): {title: string; description: string} {
  const seoMap: Record<string, {title: string; description: string}> = {
    'bloc-notes-personnalises': {
      title: 'Bloc-notes Personnalisé Entreprise avec Logo Maroc | Arteva',
      description:
        'Bloc-notes personnalisés A4/A5 avec logo entreprise. Impression quadri, reliure spirale premium. Petites quantités dès 50 ex. Livraison 48h Maroc. Devis gratuit.'
    },
    'stylos-metal-s1': {
      title: 'Stylos Personnalisés Entreprise Gravure Laser Maroc | Arteva',
      description:
        'Stylos métal personnalisés avec gravure laser ou tampographie. Corps aluminium rechargeable. Petites quantités dès 30 ex. BAT 24h. Livraison express Maroc.'
    },
    'chemise-a-rabat-classique': {
      title: 'Chemise à Rabat Personnalisée Entreprise Maroc | Arteva',
      description:
        'Chemise rabat A4 personnalisée avec logo. Carton 350g, impression offset ou numérique. Petites séries dès 100 ex. Livraison rapide partout au Maroc. Devis gratuit.'
    }
  };

  return (
    seoMap[slug] || {
      title: `${name} Personnalisé | Arteva`,
      description: description
    }
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}): Promise<Metadata> {
  const {locale, slug} = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Produit non trouvé | Arteva',
      description: 'Ce produit n\'existe pas.'
    };
  }

  const t = await getTranslations({locale, namespace: 'products'});
  const productName = t(product.nameKey.split('.').slice(1).join('.'));
  const productDescription = t(product.descriptionKey.split('.').slice(1).join('.'));

  const seoMeta = getProductSEOMeta(slug, productName, productDescription);

  return {
    title: seoMeta.title,
    description: seoMeta.description,
    openGraph: {
      title: seoMeta.title,
      description: seoMeta.description,
      images: [product.heroImage]
    }
  };
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
  setRequestLocale(locale);

  const baseProduct = getProductBySlug(params.slug);
  if (!baseProduct) {
    notFound();
  }

  // Apply price overrides from database
  const product = await getProductWithPricing(baseProduct.id, products) || baseProduct;

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
    personalization: {
      title: tProduct('personalization.title'),
      description: tProduct('personalization.description'),
      modes: {
        none: tProduct('personalization.modes.none'),
        upload: tProduct('personalization.modes.upload'),
        design: tProduct('personalization.modes.design')
      },
      uploadZone: {
        dragActive: tProduct('personalization.uploadZone.dragActive'),
        dragInactive: tProduct('personalization.uploadZone.dragInactive'),
        browse: tProduct('personalization.uploadZone.browse'),
        formats: tProduct('personalization.uploadZone.formats')
      },
      preview: {
        uploadedFile: tProduct('personalization.preview.uploadedFile'),
        designCreated: tProduct('personalization.preview.designCreated'),
        actions: {
          edit: tProduct('personalization.preview.actions.edit'),
          remove: tProduct('personalization.preview.actions.remove')
        }
      },
      actions: {
        openEditor: tProduct('personalization.actions.openEditor'),
        change: tProduct('personalization.actions.change')
      }
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
        generateBat: tProduct('editor.actions.generateBat'),
        close: tProduct('editor.actions.close'),
        fullscreen: tProduct('editor.actions.fullscreen')
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
