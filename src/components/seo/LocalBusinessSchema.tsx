/**
 * LocalBusiness Schema for Arteva
 * Helps with local SEO in Morocco (Google.ma)
 */

import {JsonLd} from './JsonLd';

interface LocalBusinessSchemaProps {
  locale?: string;
}

export function LocalBusinessSchema({locale = 'fr'}: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://arteva.ma/#business',
    name: 'Arteva',
    alternateName: 'Arteva Maroc',
    description:
      locale === 'fr'
        ? 'Objets publicitaires personnalisés pour entreprises au Maroc. Designer en ligne, accompagnement personnalisé, qualité premium.'
        : 'منتجات دعائية مخصصة للشركات في المغرب. مصمم عبر الإنترنت، مرافقة شخصية، جودة عالية.',
    url: 'https://arteva.ma',
    logo: 'https://arteva.ma/icons/icon.svg',
    image: 'https://arteva.ma/icons/icon.svg',
    telephone: '+212522001234',
    email: 'bonjour@arteva.ma',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Casablanca',
      addressLocality: 'Casablanca',
      addressRegion: 'Casablanca-Settat',
      postalCode: '20000',
      addressCountry: 'MA'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.5731,
      longitude: -7.5898
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'Morocco'
      },
      {
        '@type': 'City',
        name: 'Casablanca'
      },
      {
        '@type': 'City',
        name: 'Rabat'
      },
      {
        '@type': 'City',
        name: 'Marrakech'
      }
    ],
    priceRange: '$$',
    currenciesAccepted: 'MAD',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      }
    ],
    sameAs: [
      // Add social media profiles when available
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Catalogue Objets Publicitaires',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Mugs & Drinkware',
          itemListElement: [{
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: 'Mug céramique personnalisable'
            }
          }]
        },
        {
          '@type': 'OfferCatalog',
          name: 'Textiles corporate',
          itemListElement: [{
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: 'T-shirt personnalisé'
            }
          }]
        },
        {
          '@type': 'OfferCatalog',
          name: 'Tech & USB',
          itemListElement: [{
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: 'Clé USB personnalisable'
            }
          }]
        },
        {
          '@type': 'OfferCatalog',
          name: 'Fournitures Bureau',
          itemListElement: [{
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: 'Bloc-notes personnalisé'
            }
          }]
        }
      ]
    }
  };

  return <JsonLd data={schema} />;
}
