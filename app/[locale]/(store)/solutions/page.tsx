import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Metadata} from 'next';
import {locales, type Locale} from '@/i18n/settings';
import {SolutionsView} from '@/components/solutions/SolutionsView';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;

  const metadata = {
    fr: {
      title: 'Solutions Objets Publicitaires Entreprise - Onboarding, Événements, Cadeaux | Artevia',
      description:
        'Découvrez nos solutions clés en main : kit bienvenue employé, packs événements, cadeaux clients. Objets publicitaires personnalisés avec prix transparents et BAT 24h.'
    },
    ar: {
      title: 'حلول منتجات ترويجية للشركات - استقبال، فعاليات، هدايا | Artevia',
      description:
        'اكتشف حلولنا الجاهزة: طقم ترحيب موظفين، حزم فعاليات، هدايا عملاء. منتجات ترويجية مخصصة مع أسعار شفافة.'
    }
  };

  const seoData = metadata[locale as keyof typeof metadata] || metadata.fr;

  return {
    title: seoData.title,
    description: seoData.description,
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      type: 'website',
      locale: locale === 'ar' ? 'ar_MA' : 'fr_FR'
    },
    alternates: {
      canonical: `/${locale}/solutions`
    }
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function SolutionsPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'solutions'});

  const content = {
    hero: {
      highlight: t('hero.highlight'),
      title: t('hero.title'),
      description: t('hero.description'),
      cta: {
        primary: t('hero.cta.primary'),
        secondary: t('hero.cta.secondary')
      }
    },
    usps: {
      title: t('usps.title'),
      items: [
        {
          icon: 'palette',
          title: t('usps.items.0.title'),
          description: t('usps.items.0.description')
        },
        {
          icon: 'box',
          title: t('usps.items.1.title'),
          description: t('usps.items.1.description')
        },
        {
          icon: 'truck',
          title: t('usps.items.2.title'),
          description: t('usps.items.2.description')
        },
        {
          icon: 'shield',
          title: t('usps.items.3.title'),
          description: t('usps.items.3.description')
        }
      ]
    },
    useCases: {
      title: t('useCases.title'),
      subtitle: t('useCases.subtitle'),
      items: [
        {
          slug: 'kit-bienvenue-employe',
          title: t('useCases.items.0.title'),
          description: t('useCases.items.0.description'),
          image:
            'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80',
          badge: t('useCases.items.0.badge')
        },
        {
          slug: 'cadeaux-clients',
          title: t('useCases.items.1.title'),
          description: t('useCases.items.1.description'),
          image:
            'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80'
        },
        {
          slug: 'evenements-entreprise',
          title: t('useCases.items.2.title'),
          description: t('useCases.items.2.description'),
          image:
            'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
        },
        {
          slug: 'cadeaux-fin-annee',
          title: t('useCases.items.3.title'),
          description: t('useCases.items.3.description'),
          image:
            'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },
    trust: {
      title: t('trust.title'),
      subtitle: t('trust.subtitle')
    },
    cta: {
      title: t('cta.title'),
      description: t('cta.description'),
      button: t('cta.button')
    }
  };

  return <SolutionsView locale={locale as Locale} content={content} />;
}
