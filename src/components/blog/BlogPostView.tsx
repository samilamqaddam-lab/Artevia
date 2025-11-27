'use client';

import {motion} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {isRTL} from '@/lib/utils';
import type {Locale} from '@/i18n/settings';

interface BlogPostViewProps {
  locale: Locale;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  category: string;
  categoryLabel: string;
  publishedAt: string;
  readingTime: number;
  readingTimeLabel: string;
  backLabel: string;
}

const categoryColors: Record<string, string> = {
  guide: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  tendances: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  conseils: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'cas-client': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
};

export function BlogPostView({
  locale,
  title,
  excerpt,
  content,
  image,
  category,
  categoryLabel,
  publishedAt,
  readingTime,
  readingTimeLabel,
  backLabel
}: BlogPostViewProps) {
  const dir = isRTL(locale) ? 'rtl' : 'ltr';
  const ArrowIcon = isRTL(locale) ? () => <ArrowLeft className="h-4 w-4 rotate-180" /> : () => <ArrowLeft className="h-4 w-4" />;

  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6" dir={dir}>
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
        className="rounded-[36px] border border-slate-200 bg-white px-6 py-12 text-slate-900 shadow-[0_35px_80px_-60px_rgba(0,0,0,0.1)] sm:px-10 dark:border-white/10 dark:bg-[#121212] dark:text-slate-100 dark:shadow-[0_35px_80px_-60px_rgba(0,0,0,0.9)]"
      >
        <Link
          href={`/${locale}/blog`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-brand dark:text-slate-400 dark:hover:text-brand"
        >
          <ArrowIcon />
          {backLabel}
        </Link>

        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${categoryColors[category] || categoryColors.guide}`}>
              {categoryLabel}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {readingTime} {readingTimeLabel}
            </span>
            <time className="text-sm text-slate-500 dark:text-slate-400">
              {new Date(publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-MA' : 'fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">{title}</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{excerpt}</p>
        </header>

        {image && (
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
            <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" priority />
          </div>
        )}

        <div
          className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-slate-600 prose-a:text-brand prose-a:no-underline hover:prose-a:underline dark:prose-p:text-slate-300"
          dangerouslySetInnerHTML={{__html: content}}
        />

        <footer className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-700">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand/80"
          >
            <ArrowIcon />
            {backLabel}
          </Link>
        </footer>
      </motion.div>
    </article>
  );
}
