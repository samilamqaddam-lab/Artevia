/**
 * Article Schema for blog posts
 * Enables rich snippets in Google search results
 */

import {JsonLd} from './JsonLd';

interface ArticleSchemaProps {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedAt: string;
  updatedAt: string;
}

export function ArticleSchema({
  title,
  description,
  slug,
  image,
  publishedAt,
  updatedAt
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `https://arteva.ma/fr/blog/${slug}#article`,
    headline: title,
    description,
    url: `https://arteva.ma/fr/blog/${slug}`,
    image: image ? `https://arteva.ma${image}` : 'https://arteva.ma/icons/icon.svg',
    datePublished: publishedAt,
    dateModified: updatedAt,
    author: {
      '@type': 'Organization',
      name: 'Arteva',
      url: 'https://arteva.ma'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Arteva',
      url: 'https://arteva.ma',
      logo: {
        '@type': 'ImageObject',
        url: 'https://arteva.ma/icons/icon.svg'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://arteva.ma/fr/blog/${slug}`
    },
    inLanguage: 'fr-MA'
  };

  return <JsonLd data={schema} />;
}
