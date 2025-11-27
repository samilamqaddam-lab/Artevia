import {MetadataRoute} from 'next';
import {products} from '@/lib/products';
import {blogPosts} from '@/lib/blog';
import {locales} from '@/i18n/settings';

const BASE_URL = 'https://arteva.ma';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // Static pages per locale
  const staticPages: Array<{path: string; freq: ChangeFrequency; priority: number}> = [
    {path: '', freq: 'weekly', priority: 1.0},
    {path: '/catalog', freq: 'weekly', priority: 0.9},
    {path: '/rfq', freq: 'monthly', priority: 0.7}
  ];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: now,
        changeFrequency: page.freq,
        priority: page.priority
      });
    }

    // Product pages
    for (const product of products) {
      entries.push({
        url: `${BASE_URL}/${locale}/product/${product.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8
      });
    }

    // Blog listing page
    entries.push({
      url: `${BASE_URL}/${locale}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8
    });

    // Blog posts
    for (const post of blogPosts) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.7
      });
    }
  }

  return entries;
}
