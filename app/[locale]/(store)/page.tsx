import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Metadata} from 'next';
import {locales, type Locale} from '@/i18n/settings';
import {products} from '@/lib/products';
import {getPackById} from '@/lib/packs';
import {HomeView, type HomeContent} from '@/components/home/HomeView';

export const metadata: Metadata = {
  alternates: {
    canonical: '/fr'
  }
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

const CATEGORY_ASSETS = [
  {
    key: 'drinkware',
    image:
      'https://images.pexels.com/photos/4065895/pexels-photo-4065895.jpeg?cs=srgb&dl=pexels-cottonbro-4065895.jpg&fm=jpg',
    getHref: (locale: Locale) => `/${locale}/product/mug-personnalisable-ceramique`
  },
  {
    key: 'textile',
    image:
      'https://images.pexels.com/photos/8411586/pexels-photo-8411586.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=800',
    getHref: (locale: Locale) => `/${locale}/product/tshirt-essential-coton`
  },
  {
    key: 'tech',
    image:
      'https://images.pexels.com/photos/6200/wood-pen-usb-vintage.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    getHref: (locale: Locale) => `/${locale}/product/cle-usb-16go-bamboo`
  },
  {
    key: 'stationery',
    image:
      'https://images.pexels.com/photos/12039670/pexels-photo-12039670.jpeg?cs=srgb&dl=pexels-mockupbee-221716013-12039670.jpg&fm=jpg',
    getHref: (locale: Locale) => `/${locale}/product/bloc-notes-personnalises`
  }
];

const HERO_IMAGE = {
  src: 'https://images.pexels.com/photos/7710157/pexels-photo-7710157.jpeg?cs=srgb&dl=pexels-a-darmel-7710157.jpg&fm=jpg',
  alt: 'Équipe marketing réunie autour de goodies personnalisés'
};

const DESIGNER_IMAGE = {
  src: 'https://images.pexels.com/photos/29765802/pexels-photo-29765802.jpeg?cs=srgb&dl=pexels-jillyjillystudio-29765802.jpg&fm=jpg',
  alt: 'Interface du designer Arteva'
};

const SUSTAINABILITY_IMAGE = {
  src: 'https://images.pexels.com/photos/7309472/pexels-photo-7309472.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1200',
  alt: 'Matières naturelles et packaging recyclé'
};

export default async function HomePage({params}: {params: {locale: string}}) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const tHome = await getTranslations({locale, namespace: 'home'});
  const tProducts = await getTranslations({locale, namespace: 'products'});

  const heroTranslation = tHome.raw('hero') as {
    tagline: string;
    highlight: string;
    title: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    badges: string[];
  };

  const hero = {
    ...heroTranslation,
    primaryCta: {
      label: heroTranslation.ctaPrimary,
      href: { pathname: `/${locale}/catalog` }
    },
    secondaryCta: {
      label: heroTranslation.ctaSecondary,
      href: { pathname: `/${locale}/rfq` }
    },
    image: HERO_IMAGE
  };

  const trust = tHome.raw('trust') as {title: string; subtitle: string; logos: string[]};

  const categoriesTranslation = tHome.raw('categories') as Array<{
    title: string;
    description: string;
    tag: string;
  }>;

  const categories = categoriesTranslation.map((category, index) => {
    const asset = CATEGORY_ASSETS[index];
    return {
      ...category,
      image: asset?.image ?? HERO_IMAGE.src,
      href: { pathname: asset?.getHref(locale) ?? `/${locale}/catalog` }
    };
  });

  const designerTranslation = tHome.raw('designer') as {
    title: string;
    description: string;
    bullets: string[];
    ctaPrimary: string;
    ctaSecondary: string;
    stats: {value: string; label: string}[];
  };

  const designer = {
    ...designerTranslation,
    primaryCta: {
      label: designerTranslation.ctaPrimary,
      href: `/${locale}/catalog`
    },
    secondaryCta: {
      label: designerTranslation.ctaSecondary,
      href: `/${locale}/product/${products[0].slug}`
    },
    image: DESIGNER_IMAGE
  };

  const processContent = tHome.raw('process') as {
    title: string;
    steps: {title: string; description: string}[];
  };

  const packsTranslation = tHome.raw('packs') as {
    title: string;
    subtitle: string;
    cta: string;
    items: {
      id: string;
      title: string;
      description: string;
      price: string;
      leadTime: string;
      features: string[];
    }[];
  };

  const packs = {
    title: packsTranslation.title,
    subtitle: packsTranslation.subtitle,
    cta: packsTranslation.cta,
    items: packsTranslation.items.map((item) => ({
      ...item,
      href: { pathname: `/${locale}/rfq`, query: { pack: item.id } },
      quantityLabel: (() => {
        const packDefinition = getPackById(item.id);
        if (!packDefinition) return null;
        const parts = packDefinition.items.map((line) => {
          const product = products.find((candidate) => candidate.id === line.productId);
          if (!product) {
            return `${line.quantity} × ${line.productId}`;
          }
          const nameKey = product.nameKey.split('.').slice(1).join('.');
          const label = tProducts(nameKey);
          return `${line.quantity} × ${label}`;
        });
        if (!parts.length) return null;
        return tHome('packsQuantityPrefix', {items: parts.join(' · ')});
      })()
    }))
  };

  const sustainabilityTranslation = tHome.raw('sustainability') as {
    title: string;
    description: string;
    badges: string[];
  };

  const testimonials = tHome.raw('testimonials') as {
    title: string;
    subtitle: string;
    items: {quote: string; author: string; role: string; company: string}[];
  };

  const resourcesTranslation = tHome.raw('resources') as {
    title: string;
    subtitle: string;
    items: {title: string; description: string; label: string}[];
  };

  const resources = {
    ...resourcesTranslation,
    items: resourcesTranslation.items.map((item) => ({
      ...item,
      href: `/${locale}/rfq`
    }))
  };

  const finalCtaTranslation = tHome.raw('finalCta') as {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    contact: string;
    phoneLabel: string;
    phone: string;
    emailLabel: string;
    email: string;
    note: string;
  };

  const content: HomeContent = {
    hero,
    trust,
    categoriesTitle: tHome('categoriesTitle'),
    categoriesSubtitle: tHome('categoriesSubtitle'),
    categoryCta: tHome('categoryCta'),
    categories,
    designer,
    process: processContent,
    processDescription: tHome('processDescription'),
    packs,
    sustainability: {
      ...sustainabilityTranslation,
      image: SUSTAINABILITY_IMAGE
    },
    testimonials,
    resources,
    finalCta: {
      ...finalCtaTranslation,
      primaryCta: {
        label: finalCtaTranslation.primaryCta,
        href: `/${locale}/rfq`
      },
      secondaryCta: {
        label: finalCtaTranslation.secondaryCta,
        href: `tel:${finalCtaTranslation.phone.replace(' ', '')}`
      }
    }
  };

  return <HomeView locale={locale} content={content} />;
}
