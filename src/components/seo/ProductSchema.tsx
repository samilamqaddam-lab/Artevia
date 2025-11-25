/**
 * Product Schema for individual product pages
 * Enables rich snippets in Google search results
 */

import {JsonLd} from './JsonLd';

interface ProductSchemaProps {
  name: string;
  description: string;
  slug: string;
  image?: string;
  price?: number;
  priceCurrency?: string;
  sku?: string;
  category?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  minQuantity?: number;
}

export function ProductSchema({
  name,
  description,
  slug,
  image,
  price,
  priceCurrency = 'MAD',
  sku,
  category,
  availability = 'InStock',
  minQuantity
}: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `https://arteva.ma/fr/product/${slug}#product`,
    name,
    description,
    url: `https://arteva.ma/fr/product/${slug}`,
    image: image || 'https://arteva.ma/icons/icon.svg',
    sku: sku || slug,
    brand: {
      '@type': 'Brand',
      name: 'Arteva'
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Arteva',
      url: 'https://arteva.ma'
    },
    category,
    offers: {
      '@type': 'Offer',
      url: `https://arteva.ma/fr/product/${slug}`,
      priceCurrency,
      price: price || undefined,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: `https://schema.org/${availability}`,
      seller: {
        '@type': 'Organization',
        name: 'Arteva',
        url: 'https://arteva.ma'
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'MA'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 14,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 5,
            unitCode: 'DAY'
          }
        }
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'MA',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail'
      }
    },
    ...(minQuantity && {
      additionalProperty: {
        '@type': 'PropertyValue',
        name: 'Quantité minimum',
        value: minQuantity
      }
    })
  };

  return <JsonLd data={schema} />;
}
