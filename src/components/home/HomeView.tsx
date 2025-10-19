/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {motion} from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {ArrowUpRight, Check, Sparkles} from 'lucide-react';
import {Button} from '@/components/ui/Button';
import {isRTL} from '@/lib/utils';
import type {Locale} from '@/i18n/settings';

type CTA = {
  label: string;
  href: { pathname: string; query?: Record<string, string> } | string;
};

type HeroContent = {
  tagline: string;
  highlight: string;
  title: string;
  description: string;
  badges: string[];
  primaryCta: CTA;
  secondaryCta: CTA;
  image: {src: string; alt: string};
};

type TrustContent = {
  title: string;
  subtitle: string;
  logos: string[];
};

type CategoryContent = {
  title: string;
  description: string;
  tag: string;
  image: string;
  href: { pathname: string; query?: Record<string, string> } | string;
};

type DesignerContent = {
  title: string;
  description: string;
  bullets: string[];
  primaryCta: CTA;
  secondaryCta: CTA;
  stats: {value: string; label: string}[];
  image: {src: string; alt: string};
};

type ProcessStep = {
  title: string;
  description: string;
};

type PacksContent = {
  title: string;
  subtitle: string;
  cta: string;
  items: {
    id: string;
    title: string;
    badge?: string;
    discount?: string;
    description: string;
    price: string;
    leadTime: string;
    features: string[];
    href: { pathname: string; query?: Record<string, string> } | string;
    quantityLabel: string | null;
  }[];
};

type SustainabilityContent = {
  title: string;
  description: string;
  badges: string[];
  image: {src: string; alt: string};
};

type TestimonialContent = {
  title: string;
  subtitle: string;
  items: {quote: string; author: string; role: string; company: string}[];
};

type ResourcesContent = {
  title: string;
  subtitle: string;
  items: {title: string; description: string; label: string; href: string}[];
};

type FinalCtaContent = {
  title: string;
  description: string;
  primaryCta: CTA;
  secondaryCta: CTA;
  contact: string;
  phoneLabel: string;
  phone: string;
  emailLabel: string;
  email: string;
  note: string;
};

export type HomeContent = {
  hero: HeroContent;
  trust: TrustContent;
  categoriesTitle: string;
  categoriesSubtitle: string;
  categoryCta: string;
  categories: CategoryContent[];
  designer: DesignerContent;
  process: {title: string; steps: ProcessStep[]};
  processDescription: string;
  packs: PacksContent;
  sustainability: SustainabilityContent;
  testimonials: TestimonialContent;
  resources: ResourcesContent;
  finalCta: FinalCtaContent;
};

interface HomeViewProps {
  locale: Locale;
  content: HomeContent;
}

const fadeUp = (delay = 0) => ({
  initial: {opacity: 0, y: 24},
  animate: {opacity: 1, y: 0},
  transition: {duration: 0.6, delay}
});

export function HomeView({locale, content}: HomeViewProps) {
  const dir = isRTL(locale) ? 'rtl' : 'ltr';
  const {
    hero,
    trust,
    categoriesTitle,
    categoriesSubtitle,
    categoryCta,
    categories,
    designer,
    process,
    processDescription,
    packs,
    sustainability,
    testimonials,
    resources,
    finalCta
  } = content;

  return (
    <div className="space-y-24 pb-20" dir={dir}>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-b-[48px] bg-slate-100 text-slate-900 dark:bg-[#171717] dark:text-slate-100">
        <div className="pointer-events-none absolute -left-24 top-0 hidden h-72 w-72 rounded-full bg-brand/30 blur-3xl sm:block dark:bg-brand/40" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-accent/30 blur-3xl dark:bg-accent/40" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div {...fadeUp()} className="space-y-6">
            <span className="inline-flex items-center rounded-full border border-brand/30 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              {hero.tagline}
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white">
              {hero.title}{' '}
              <span className="text-brand">{hero.highlight}</span>
            </h1>
            <p className="max-w-xl text-lg text-slate-600 sm:text-xl dark:text-slate-300">{hero.description}</p>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Button asChild size="lg">
                <Link href={hero.primaryCta.href as any}>{hero.primaryCta.label}</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href={hero.secondaryCta.href as any}>{hero.secondaryCta.label}</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-300">
              {hero.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 shadow-sm backdrop-blur dark:bg-white/5"
                >
                  <ArrowUpRight size={14} aria-hidden />
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-floating dark:border-white/10 dark:bg-[#111111]"
            {...fadeUp(0.15)}
          >
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Logos */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-[36px] border border-slate-200 bg-white px-6 py-10 text-slate-900 shadow-sm sm:px-10 dark:border-white/10 dark:bg-[#121212] dark:text-slate-100">
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {trust.subtitle}
          </p>
          <h2 className="mt-2 text-center text-xl font-semibold text-slate-900 dark:text-white">{trust.title}</h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">
            {trust.logos.map((logo) => (
              <span
                key={logo}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm dark:border-white/10 dark:bg-[#0f0f0f]"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 space-y-3 text-center text-slate-900 dark:text-slate-100">
          <h2 className="text-2xl font-semibold">{categoriesTitle}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">{categoriesSubtitle}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <motion.article
              key={category.title}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-45px_rgba(130,212,187,0.45)] dark:border-white/10 dark:bg-[#151515] dark:text-slate-100"
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, amount: 0.3}}
              transition={{duration: 0.4, delay: index * 0.08}}
            >
              <Link href={category.href as any} className="relative aspect-[4/3]">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 20vw"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur dark:bg-white/10 dark:text-slate-200">
                  {category.tag}
                </span>
              </Link>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <Link href={category.href as any}>
                  <h3 className="text-lg font-semibold text-slate-900 transition-colors hover:text-brand dark:text-white dark:hover:text-brand">{category.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{category.description}</p>
                </Link>
                <Button asChild variant="ghost" size="sm" className="mt-auto self-start text-sm font-semibold text-brand">
                  <Link href={category.href as any}>{categoryCta}</Link>
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Designer */}
      <section className="bg-slate-100 py-16 dark:bg-[#111111]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div {...fadeUp()} className="space-y-6 text-slate-900 dark:text-slate-100">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
              Designer Arteva
            </span>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{designer.title}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">{designer.description}</p>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
              {designer.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand/20 text-brand">
                    <Check size={14} />
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-4">
              {designer.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-slate-200 bg-white px-5 py-4 text-center shadow-sm dark:border-white/10 dark:bg-[#121212]"
                >
                  <div className="text-2xl font-semibold text-brand">{stat.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="md">
                <Link href={designer.primaryCta.href as any}>{designer.primaryCta.label}</Link>
              </Button>
              <Button asChild variant="secondary" size="md">
                <Link href={designer.secondaryCta.href as any}>{designer.secondaryCta.label}</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0f0f0f]"
            {...fadeUp(0.1)}
          >
            <Image
              src={designer.image.src}
              alt={designer.image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 space-y-3 text-center text-slate-900 dark:text-slate-100">
          <h2 className="text-2xl font-semibold">{process.title}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">{processDescription}</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-4">
          {process.steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm dark:border-white/10 dark:bg-[#151515]"
              initial={{opacity: 0, y: 24}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, amount: 0.25}}
              transition={{duration: 0.4, delay: index * 0.08}}
            >
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand text-lg font-semibold text-charcoal shadow-floating">
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Packs */}
      <section className="bg-slate-100 py-16 dark:bg-[#0f0f0f]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 text-center text-slate-900 dark:text-slate-100">
            <h2 className="text-2xl font-semibold">{packs.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{packs.subtitle}</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {packs.items.map((item, index) => (
              <Link
                key={item.id}
                href={item.href as any}
                data-pack-id={item.id}
              >
                <motion.article
                  className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-brand/50 hover:shadow-[0_30px_60px_-45px_rgba(130,212,187,0.45)] dark:border-white/10 dark:bg-[#161616] dark:hover:border-brand/50"
                  initial={{opacity: 0, y: 20}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true, amount: 0.3}}
                  transition={{duration: 0.4, delay: index * 0.08}}
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {item.badge && (
                      <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand dark:bg-brand/20">
                        <Sparkles size={12} />
                        {item.badge}
                      </div>
                    )}
                    {item.discount && (
                      <div className="inline-flex w-fit items-center rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent">
                        {item.discount}
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-brand dark:text-white dark:group-hover:text-brand">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
                  <div className="mt-4 space-y-1 text-sm text-slate-500 dark:text-slate-400">
                    <div>{item.price}</div>
                    <div>{item.leadTime}</div>
                  </div>
                  {item.quantityLabel && (
                    <div className="mt-4 rounded-2xl bg-brand/10 px-3 py-3 text-xs leading-relaxed font-semibold text-brand">
                      {item.quantityLabel}
                    </div>
                  )}
                  <ul className="mt-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/30 text-charcoal">
                          <Check size={12} />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto self-start pt-5 pointer-events-none">
                    <Button variant="secondary" size="sm">
                      {packs.cta}
                    </Button>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="mx-auto max-w-6xl grid gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div {...fadeUp()} className="space-y-5 rounded-[36px] border border-slate-200 bg-white p-8 text-slate-900 shadow-sm dark:border-white/10 dark:bg-[#121212] dark:text-slate-100">
          <h2 className="text-2xl font-semibold">{sustainability.title}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">{sustainability.description}</p>
          <div className="flex flex-wrap gap-3">
            {sustainability.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-accent/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent"
              >
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
        <motion.div {...fadeUp(0.1)} className="relative aspect-[4/3] w-full overflow-hidden rounded-[36px]">
          <Image
            src={sustainability.image.src}
            alt={sustainability.image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-100 py-16 dark:bg-[#111111]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-10">
          <div className="text-center text-slate-900 dark:text-slate-100">
            <h2 className="text-2xl font-semibold">{testimonials.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{testimonials.subtitle}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.items.map((item, index) => (
              <motion.article
                key={item.quote}
                initial={{opacity: 0, y: 18}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: 0.3}}
                transition={{duration: 0.4, delay: index * 0.08}}
                className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm dark:border-white/10 dark:bg-[#161616]"
              >
                <p className="flex-1 text-sm italic text-slate-700 dark:text-slate-200">“{item.quote}”</p>
                <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                  <div className="font-semibold text-slate-900 dark:text-white">{item.author}</div>
                  <div>{item.role}</div>
                  <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.company}</div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 space-y-3 text-center text-slate-900 dark:text-slate-100">
          <h2 className="text-2xl font-semibold">{resources.title}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">{resources.subtitle}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {resources.items.map((item, index) => (
            <motion.article
              key={item.title}
              className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-45px_rgba(130,212,187,0.45)] dark:border-white/10 dark:bg-[#151515]"
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, amount: 0.3}}
              transition={{duration: 0.4, delay: index * 0.05}}
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
              <Button asChild variant="ghost" size="sm" className="mt-auto self-start text-sm font-semibold text-brand">
                <Link href={item.href as any}>{item.label}</Link>
              </Button>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-[36px] bg-brand text-charcoal shadow-lg">
          <div className="grid gap-8 p-10 md:grid-cols-[1fr_auto] md:items-center">
            <div className="space-y-5">
              <h2 className="text-3xl font-semibold">{finalCta.title}</h2>
              <p className="text-base">{finalCta.description}</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="lg" variant="primary" className="bg-charcoal text-white hover:bg-charcoal/90">
                  <Link href={finalCta.primaryCta.href as any}>{finalCta.primaryCta.label}</Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="bg-white text-charcoal hover:bg-white/90">
                  <Link href={finalCta.secondaryCta.href as any}>{finalCta.secondaryCta.label}</Link>
                </Button>
              </div>
            </div>
            <div className="space-y-3 rounded-3xl bg-white/10 p-6 text-sm">
              <div className="font-semibold uppercase tracking-wide">{finalCta.contact}</div>
              <div>
                {finalCta.phoneLabel}: <a className="underline" href={`tel:${finalCta.phone.replace(' ', '')}`}>{finalCta.phone}</a>
              </div>
              <div>
                {finalCta.emailLabel}: <a className="underline" href={`mailto:${finalCta.email}`}>{finalCta.email}</a>
              </div>
              <div className="text-xs uppercase tracking-wide">{finalCta.note}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
