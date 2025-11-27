import {getTranslations, setRequestLocale} from 'next-intl/server';
import {locales, type Locale} from '@/i18n/settings';
import {blogPosts} from '@/lib/blog';
import {BlogListView} from '@/components/blog/BlogListView';
import type {Metadata} from 'next';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: {locale: string}}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const t = await getTranslations({locale, namespace: 'blog'});

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `https://arteva.ma/${locale}/blog`,
      languages: {
        fr: 'https://arteva.ma/fr/blog',
        ar: 'https://arteva.ma/ar/blog'
      }
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: `https://arteva.ma/${locale}/blog`,
      siteName: 'Arteva',
      locale: locale === 'ar' ? 'ar_MA' : 'fr_MA',
      type: 'website'
    }
  };
}

export default async function BlogPage({params}: {params: {locale: string}}) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'blog'});

  const posts = blogPosts.map((post) => ({
    ...post,
    title: t(post.titleKey.replace('blog.', '')),
    excerpt: t(post.excerptKey.replace('blog.', ''))
  }));

  return (
    <BlogListView
      locale={locale}
      title={t('title')}
      description={t('description')}
      posts={posts}
      categoryLabels={{
        guide: t('categories.guide'),
        tendances: t('categories.tendances'),
        conseils: t('categories.conseils'),
        'cas-client': t('categories.cas-client')
      }}
      readingTimeLabel={t('readingTime')}
    />
  );
}
