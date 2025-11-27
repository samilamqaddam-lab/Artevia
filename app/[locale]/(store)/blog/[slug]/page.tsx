import {getTranslations, setRequestLocale} from 'next-intl/server';
import {locales, type Locale} from '@/i18n/settings';
import {blogPosts, getBlogPostBySlug} from '@/lib/blog';
import {BlogPostView} from '@/components/blog/BlogPostView';
import {ArticleSchema, BreadcrumbSchema} from '@/components/seo';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';

export function generateStaticParams() {
  const params: Array<{locale: string; slug: string}> = [];
  for (const locale of locales) {
    for (const post of blogPosts) {
      params.push({locale, slug: post.slug});
    }
  }
  return params;
}

export async function generateMetadata({
  params
}: {
  params: {locale: string; slug: string};
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return {title: 'Article non trouvé'};
  }

  const t = await getTranslations({locale, namespace: 'blog'});
  const title = t(post.titleKey.replace('blog.', ''));
  const description = t(post.excerptKey.replace('blog.', ''));

  return {
    title: `${title} | Blog Arteva`,
    description,
    alternates: {
      canonical: `https://arteva.ma/${locale}/blog/${post.slug}`,
      languages: {
        fr: `https://arteva.ma/fr/blog/${post.slug}`,
        ar: `https://arteva.ma/ar/blog/${post.slug}`
      }
    },
    openGraph: {
      title,
      description,
      url: `https://arteva.ma/${locale}/blog/${post.slug}`,
      siteName: 'Arteva',
      locale: locale === 'ar' ? 'ar_MA' : 'fr_MA',
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: ['Arteva'],
      images: [
        {
          url: `https://arteva.ma${post.image}`,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://arteva.ma${post.image}`]
    }
  };
}

export default async function BlogPostPage({params}: {params: {locale: string; slug: string}}) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);

  const post = getBlogPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const t = await getTranslations({locale, namespace: 'blog'});

  const title = t(post.titleKey.replace('blog.', ''));
  const excerpt = t(post.excerptKey.replace('blog.', ''));
  const content = t(post.contentKey.replace('blog.', ''));

  const breadcrumbItems = [
    {name: 'Accueil', url: `https://arteva.ma/${locale}`},
    {name: 'Blog', url: `https://arteva.ma/${locale}/blog`},
    {name: title, url: `https://arteva.ma/${locale}/blog/${post.slug}`}
  ];

  return (
    <>
      <ArticleSchema
        title={title}
        description={excerpt}
        slug={post.slug}
        image={post.image}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <BlogPostView
        locale={locale}
        title={title}
        excerpt={excerpt}
        content={content}
        image={post.image}
        category={post.category}
        categoryLabel={t(`categories.${post.category}`)}
        publishedAt={post.publishedAt}
        readingTime={post.readingTime}
        readingTimeLabel={t('readingTime')}
        backLabel={t('backToList')}
      />
    </>
  );
}
