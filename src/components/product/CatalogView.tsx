'use client';

import {motion} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {Button} from '@/components/ui/Button';
import type {Product} from '@/lib/products';
import {formatPrice, isRTL} from '@/lib/utils';
import type {Locale} from '@/i18n/settings';

interface CatalogProduct extends Product {
  name: string;
  description: string;
  methodLabels: string[];
  leadTimeLabels: string[];
}

interface CatalogViewProps {
  locale: Locale;
  title: string;
  description: string;
  products: CatalogProduct[];
  ctaLabel: string;
  moqLabel: string;
}

const MIN_DISPLAY_DELAY = 0.08;

export function CatalogView({
  locale,
  title,
  description,
  products,
  ctaLabel,
  moqLabel
}: CatalogViewProps) {
  const dir = isRTL(locale) ? 'rtl' : 'ltr';
  const fromLabel = locale === 'ar' ? 'ابتداءً من' : 'À partir de';
  const piecesLabel = locale === 'ar' ? 'قطعة' : 'pièces';

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6" dir={dir}>
      <div className="rounded-[36px] border border-slate-200 bg-white px-6 py-12 text-slate-900 shadow-[0_35px_80px_-60px_rgba(0,0,0,0.1)] sm:px-10 dark:border-white/10 dark:bg-[#121212] dark:text-slate-100 dark:shadow-[0_35px_80px_-60px_rgba(0,0,0,0.9)]">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">{title}</h1>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">{description}</p>
        </header>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => {
            const startingTier = product.methods
              .flatMap((method) => method.priceTiers)
              .reduce((best, tier) => {
                if (!best) return tier;
                return tier.unitPrice < best.unitPrice ? tier : best;
              }, product.methods[0]?.priceTiers[0]);

            return (
              <motion.article
                key={product.id}
                initial={{opacity: 0, y: 30}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: 0.25}}
                transition={{duration: 0.4, delay: index * MIN_DISPLAY_DELAY}}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(130,212,187,0.35)] dark:border-white/10 dark:bg-[#161616] dark:text-slate-100 dark:hover:shadow-[0_30px_60px_-40px_rgba(130,212,187,0.65)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={product.heroImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 30vw"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{product.name}</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{product.description}</p>
                  </div>
                  <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-white/5 dark:text-slate-300">
                      <span>{moqLabel}</span>
                      <span className="text-slate-900 dark:text-white">{product.moq}</span>
                    </div>
                    {startingTier && (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-[#121212] dark:text-slate-200">
                        <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{fromLabel}</span>
                        <div className="mt-1 flex items-baseline justify-between">
                          <span className="text-base font-semibold text-slate-900 dark:text-white">
                            {formatPrice(startingTier.unitPrice, locale)} HT
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-300">
                            {startingTier.minQuantity} {piecesLabel}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button asChild variant="primary" size="md" className="mt-auto">
                    <Link href={`/${locale}/product/${product.slug}`}>{ctaLabel}</Link>
                  </Button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
