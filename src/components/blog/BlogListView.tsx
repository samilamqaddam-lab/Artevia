'use client';

import {motion} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {isRTL} from '@/lib/utils';
import type {Locale} from '@/i18n/settings';
import type {BlogPost} from '@/lib/blog';

interface BlogPostWithTranslations extends BlogPost {
  title: string;
  excerpt: string;
}

interface BlogListViewProps {
  locale: Locale;
  title: string;
  description: string;
  posts: BlogPostWithTranslations[];
  categoryLabels: Record<string, string>;
  readingTimeLabel: string;
}

const categoryColors: Record<string, string> = {
  guide: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  tendances: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  conseils: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'cas-client': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
};

export function BlogListView({
  locale,
  title,
  description,
  posts,
  categoryLabels,
  readingTimeLabel
}: BlogListViewProps) {
  const dir = isRTL(locale) ? 'rtl' : 'ltr';

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6" dir={dir}>
      <div className="rounded-[36px] border border-slate-200 bg-white px-6 py-12 text-slate-900 shadow-[0_35px_80px_-60px_rgba(0,0,0,0.1)] sm:px-10 dark:border-white/10 dark:bg-[#121212] dark:text-slate-100 dark:shadow-[0_35px_80px_-60px_rgba(0,0,0,0.9)]">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">{title}</h1>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">{description}</p>
        </header>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, amount: 0.25}}
              transition={{duration: 0.4, delay: index * 0.08}}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(130,212,187,0.35)] dark:border-white/10 dark:bg-[#161616] dark:text-slate-100 dark:hover:shadow-[0_30px_60px_-40px_rgba(130,212,187,0.65)]"
            >
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800"
              >
                {post.image && (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand/20 to-brand/40">
                  <span className="text-4xl">📝</span>
                </div>
              </Link>

              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${categoryColors[post.category] || categoryColors.guide}`}
                  >
                    {categoryLabels[post.category]}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {post.readingTime} {readingTimeLabel}
                  </span>
                </div>

                <Link href={`/${locale}/blog/${post.slug}`}>
                  <h2 className="text-lg font-semibold text-slate-900 transition-colors hover:text-brand dark:text-white dark:hover:text-brand">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{post.excerpt}</p>
                </Link>

                <div className="mt-auto pt-4">
                  <time className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(post.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-MA' : 'fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="mt-12 text-center text-slate-500 dark:text-slate-400">Aucun article pour le moment.</p>
        )}
      </div>
    </section>
  );
}
