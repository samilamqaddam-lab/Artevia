import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Metadata} from 'next';
import {locales, type Locale} from '@/i18n/settings';
import {KitBienvenueView} from '@/components/entreprises/KitBienvenueView';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;

  const metadata = {
    fr: {
      title: 'Kit Bienvenue Employé Personnalisé Maroc | Pack Onboarding Entreprise | Artevia',
      description:
        'Kit bienvenue employé personnalisé pour onboarding entreprise. Bloc-notes, stylos, goodies avec logo. Petites quantités dès 10 kits. Livraison 48h Maroc. Devis gratuit.'
    },
    ar: {
      title: 'طقم الترحيب بالموظفين الجدد المخصص المغرب | Artevia',
      description:
        'طقم ترحيب مخصص للموظفين الجدد. دفاتر، أقلام، هدايا بشعار الشركة. كميات صغيرة من 10 أطقم. توصيل 48 ساعة.'
    }
  };

  const seoData = metadata[locale as keyof typeof metadata] || metadata.fr;

  return {
    title: seoData.title,
    description: seoData.description,
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      type: 'article',
      locale: locale === 'ar' ? 'ar_MA' : 'fr_FR',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 630,
          alt: 'Kit Bienvenue Employé Personnalisé'
        }
      ]
    },
    alternates: {
      canonical: `/${locale}/entreprises/kit-bienvenue-employe`
    }
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function KitBienvenuePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'kitBienvenue'});

  const content = {
    hero: {
      badge: t('hero.badge'),
      title: t('hero.title'),
      description: t('hero.description'),
      cta: {
        primary: t('hero.cta.primary'),
        secondary: t('hero.cta.secondary')
      },
      image:
        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80'
    },
    benefits: {
      title: t('benefits.title'),
      items: [
        {
          icon: 'users',
          title: t('benefits.items.0.title'),
          description: t('benefits.items.0.description')
        },
        {
          icon: 'heart',
          title: t('benefits.items.1.title'),
          description: t('benefits.items.1.description')
        },
        {
          icon: 'trending-up',
          title: t('benefits.items.2.title'),
          description: t('benefits.items.2.description')
        },
        {
          icon: 'award',
          title: t('benefits.items.3.title'),
          description: t('benefits.items.3.description')
        }
      ]
    },
    included: {
      title: t('included.title'),
      subtitle: t('included.subtitle'),
      packs: [
        {
          name: t('included.packs.0.name'),
          description: t('included.packs.0.description'),
          price: 'MAD',
          items: [
            t('included.packs.0.items.0'),
            t('included.packs.0.items.1'),
            t('included.packs.0.items.2'),
            t('included.packs.0.items.3')
          ]
        },
        {
          name: t('included.packs.1.name'),
          description: t('included.packs.1.description'),
          price: 'MAD',
          popular: true,
          items: [
            t('included.packs.1.items.0'),
            t('included.packs.1.items.1'),
            t('included.packs.1.items.2'),
            t('included.packs.1.items.3'),
            t('included.packs.1.items.4')
          ]
        },
        {
          name: t('included.packs.2.name'),
          description: t('included.packs.2.description'),
          price: 'MAD',
          items: [
            t('included.packs.2.items.0'),
            t('included.packs.2.items.1'),
            t('included.packs.2.items.2'),
            t('included.packs.2.items.3'),
            t('included.packs.2.items.4'),
            t('included.packs.2.items.5')
          ]
        }
      ]
    },
    process: {
      title: t('process.title'),
      steps: [
        {
          number: 1,
          title: t('process.steps.0.title'),
          description: t('process.steps.0.description')
        },
        {
          number: 2,
          title: t('process.steps.1.title'),
          description: t('process.steps.1.description')
        },
        {
          number: 3,
          title: t('process.steps.2.title'),
          description: t('process.steps.2.description')
        },
        {
          number: 4,
          title: t('process.steps.3.title'),
          description: t('process.steps.3.description')
        }
      ]
    },
    testimonials: {
      title: t('testimonials.title'),
      items: [
        {
          quote: t('testimonials.items.0.quote'),
          author: t('testimonials.items.0.author'),
          role: t('testimonials.items.0.role'),
          company: t('testimonials.items.0.company')
        },
        {
          quote: t('testimonials.items.1.quote'),
          author: t('testimonials.items.1.author'),
          role: t('testimonials.items.1.role'),
          company: t('testimonials.items.1.company')
        }
      ]
    },
    cta: {
      title: t('cta.title'),
      description: t('cta.description'),
      button: t('cta.button')
    }
  };

  // Schema.org Article markup pour SEO
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Kit Bienvenue Employé Personnalisé - Guide Complet Onboarding',
    description: content.hero.description,
    image:
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80',
    author: {
      '@type': 'Organization',
      name: 'Artevia'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Artevia',
      logo: {
        '@type': 'ImageObject',
        url: 'https://artevia.ma/logo.png'
      }
    },
    datePublished: '2025-10-15',
    dateModified: '2025-10-15'
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(articleSchema)}}
      />
      <KitBienvenueView locale={locale as Locale} content={content} />
    </>
  );
}
